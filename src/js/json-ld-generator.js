// Enable materialize selects
$(document).ready(function() {
    $('select').material_select();
});
        
/*
 * Loading schema.org objects from jsonld on webpage start
 */
var SCHEMA = new Schema();
$.getJSON('./../src/schema/schema.json', {format: "json"}, function (json) {
    // creating Schema from received json
    SCHEMA.addJSON(json);
}).fail(function (jqxhr, textStatus, error) {
    alert("unable to load jsonld!");
});


// This datatypes can be visualized as text
// They have instances and are not only abstract types (like the type "DataType"
// TODO (optional): Handle integer and datetime in more detail
var TEXT_DATA_TYPES = ["Date", "DateTime", "Integer", "Number", "Text", "Time", "URL"]

/*
 * Create property input fields when a schema.org thing is selected
 */
$("#sel-thing").change(function () {
    // Remove precreated input fields
    $(".properties-row").remove();

    // Load schema of selected Thing
    var selectedType = $(this).find(":selected").text();
    var type = SCHEMA.getType(selectedType);

    // Ids for handlers
    var textIDs = [];
    var checkIDs = [];

    // Visualize each property
    $.each(type.properties, function(index, value) {
	// Construct html
	var capitalzedProperty = capitalizeFirstLetter(value);
	var rowID = "1-" + value;
	var html = "<div id=\"" + rowID + "\" class=\"row properties-row input-field\">"
	var dataTypes = SCHEMA.getPropertyDataTypes(value);
	
	// Construct selection
	if (dataTypes.length > 1) {
	    html += "<select class=\"sel-datatype\">" +
		"<option disabled selected>Choose datatype</option>";
	    $.each(dataTypes, function(indexDatatype, valueDatatype) {
		html += "<option>" + valueDatatype + "</option>";
	    });
	    html += "</select>" +
		"<label>" + 
		capitalzedProperty + ":" +
		"</label>";

	// Construct input text field
	} else if ($.inArray(dataTypes[0], TEXT_DATA_TYPES) !== -1) {
	    var inputID = "input-" + rowID;
	    html += "<input type=\"text\" id=\"" + inputID + "\">" +
		"<label for=\"" + inputID + "\">" + 
		capitalzedProperty + ":" + 
		"</label>";
	    textIDs.push(inputID);

	// Construct checkbox for complex substructure
	} else {
	    var checkID = "check-" + rowID;
	    html += "<input type=\"checkbox\" id=\"" + checkID + "\" class=\"sel-datatype\"/>" +
		"<label for=\"" + checkID + "\">" + capitalzedProperty + "</label>";
	    checkIDs.push(checkID);
	}
	html += "</div>";
	
	// Add html
	$("#properties-col").append(html);

	// Add datehandler for dates
	if (($.inArray("Date", dataTypes) !== -1) ||
	    ($.inArray("DateTime", dataTypes) !== -1)) {
	    var property = $("#" + value);
	    property.pickadate({
		format: 'yyyy-mm-dd', // ISO 8601 due to https://schema.org/Date
		selectYears: true,
		selectMonths: true,
		onClose: function() { 
		    propertyChanges(property.attr('id'), property.val());
		}
	    });	 
	};   
    });

    $('select').material_select();
    $("#properties-col").css("opacity", "0.0");
    $("#properties-col").animate({opacity: 1.0}, 1000);

    // Initial JSON-LD
    var json = { "@context": "http://schema.org",  "@type": selectedType };
    $("#json-ld-col").text(JSON.stringify(json, undefined, 4));
    
    $.each(textIDs, function(index, value) {
	$("#" + value).keyup(function(event) {
	    var parentRow = $(this).closest(".properties-row");
	    propertyChanges(parentRow.attr('id').split("-").slice(1).join("-"), $(this).val());
	});
    });

    /* $.each(checkIDs, function(index, value) {
	$("#" + value).change(function(event) {
	    var parentRow = $(this).closest(".properties-row");
	    propertyChanges(parentRow.attr('id').split("-").slice(1).join("-"), $(this).val());
	});
    }); */

    // For complexer substructures
    selectionChanged();
});

/*
 * Inner selection changed (recursive!)
 */
function selectionChanged() {
    $(".sel-datatype").change(function () {
	var isCheckBox = ($(this).attr("type") === "checkbox");

	// Do not consider select wrapper
	if ($(this).hasClass("initialized") && !$(this).hasClass("select-wrapper") ||
	   (isCheckBox)) {
	    var parentRow = $(this).closest(".properties-row");

	    var parentID = parentRow.attr("id");
	    var splittedID = parentID.split("-");
	    var indent = parseInt(splittedID[0]);
	    var property = splittedID.slice(1).join("-");
	    
	    // Construct column
	    var colID = "col" + "-" + (indent+1) + "-" + property;
	    $("#" + colID).remove();

	    if (isCheckBox && !$(this).is(':checked')) {
		propertyChanges(property, "");
	    } else {
		// Append column to div as new substructure
		var col = "<div id=\"" + colID + "\"" + "class=\"col m" + (12-indent) + " offset-m" + indent + " orange lighten-3\"></div>";
		parentRow.append(col);

		var selected = parentRow.find(":selected").text();
		if ($.inArray(selected, TEXT_DATA_TYPES) !== -1) {
		    var rowID = (indent+1) + "-" + property;
		    var inputID = "input-" + rowID;
		    input_html = "<div id=\""+ rowID + "\" class=\"row properties-row input-field\">" +
			"<input type=\"text\" id=\"" + inputID + "\">" +
			"<label for=\"" + inputID + "\">" + 
			capitalizeFirstLetter(property) + ":" + 
			"</label>" + 
			"</div>";

		    $("#" + colID).append(input_html);
		    $("#" + colID).css("opacity", "0.0");
		    $("#" + colID).animate({opacity: 1.0}, 1000);

		    propertyChanges(property, "");
		    $("#" + inputID).keyup(function(event) {
			propertyChanges(property, $(this).val());
		    });
		} else if (selected === "Boolean") {
		    var rowID = (indent+1) + "-" + property;
		    var checkID = "check-" + rowID
		    input_html = "<div id=\"" + rowID + "\" class=\"row properties-row input-field\">" +
			"<input type=\"checkbox\" id=\"" + checkID + "\" />" +
			"<label for=\"" + checkID + "\">" + property + "</label>" +
			"</div>";

		    $("#" + colID).append(input_html);
		    $("#" + colID).css("opacity", "0.0");
		    $("#" + colID).animate({opacity: 1.0}, 1000);

		    propertyChanges(property, "false");
		    $("#" + checkID).change(function() {
			propertyChanges(property, $(this).is(':checked').toString());
		    });
		} else {
		    var type = "";
		    if (isCheckBox) {
			type = capitalizeFirstLetter(splittedID[splittedID.length - 1]);
		    } else {
			type = selected;
		    }
		    typeInside = SCHEMA.getType(type);

		    // TODO: Handle if undefined
		    if (typeInside === undefined) {
			var test = SCHEMA.getPropertyDataTypes(splittedID[splittedID.length - 1]);
		    }

		    var select_html = "";
		    var input_html = "";
		    var changeIDs = [];
		    $.each(typeInside.properties, function(index, value) {
			// Construct html
			var newProperty = property + "-" + value
			var capitalzedProperty = capitalizeFirstLetter(newProperty);
			var dataTypes = SCHEMA.getPropertyDataTypes(value);
			var rowID = (indent+1) + "-" + newProperty;
			if (dataTypes.length > 1) {
			    select_html += "<div id=\"" + rowID + "\" class=\"row properties-row input-field\">";
			    select_html += "<select class=\"sel-datatype\">" +
				"<option disabled selected>Choose datatype</option>";
			    $.each(dataTypes, function(indexDatatype, valueDatatype) {
				select_html += "<option>" + valueDatatype + "</option>";
			    });
			    select_html += "</select>" +
				"<label>" + 
				capitalzedProperty + ":" +
				"</label>";
			    select_html += "</div>";
			} else if($.inArray(dataTypes[0], TEXT_DATA_TYPES) !== -1) {
			    var inputID = "input-" + rowID;
			    input_html += "<div id=\"" + rowID + "\" class=\"row properties-row input-field\">";
			    input_html += "<input type=\"text\" id=\"" + inputID + "\">" +
				"<label for=\"" + inputID + "\">" + 
				capitalzedProperty + ":" + 
				"</label>";
			    input_html += "</div>";
			    changeIDs.push(inputID);
			} else {
			    var checkID = "check-" + rowID;
			    input_html += "<div id=\"" + rowID + "\" class=\"row properties-row input-field\">";
			    input_html += "<input type=\"checkbox\" id=\"" + checkID + "\" class=\"sel-datatype\"/>" +
				"<label for=\"" + checkID + "\">" + capitalzedProperty + "</label>";
			    input_html += "</div>";
			}
		    });

		    // First materialize selects, otherwise there is a ui problem
		    $("#" + colID).append(select_html);
		    $('select').material_select();
		    $("#" + colID).append(input_html);
		    $("#" + colID).css("opacity", "0.0");
		    $("#" + colID).animate({opacity: 1.0}, 1000);

		    if (isCheckBox) {
			propertyChanges(capitalizeFirstLetter(property), capitalizeFirstLetter(property), true);
		    } else {
			propertyChanges(capitalizeFirstLetter(property), selected, true);
		    }
		    $.each(changeIDs, function(index, value) {
			$("#" + value).keyup(function(event) {
			    var parentRow = $(this).closest(".properties-row");
			    propertyChanges(parentRow.attr('id').split("-").slice(1).join("-"), $(this).val());
			});
		    });

		    
		    selectionChanged();
		}
	    }
	}	
    });
}

/*
 * Create JSON-LD on change
 */
function propertyChanges(property, value, selectChange=false) {
    console.log(property);
    console.log(value);
    var jsonText =  $("#json-ld-col").text().trim();
    var json = JSON.parse(jsonText);
    var propertyArray = property.split("-");

    // Set property value in JSON
    if (selectChange === false) {
	if (value.length == 0) {
	    if (propertyArray.length === 1) {
		delete json[capitalizeFirstLetter(property)];
	    } else {
		// Eval workaround to access json on specified position
		jsonAccess = "delete json";
		$.each(propertyArray, function(index, val) {
		    jsonAccess += "[\"" + capitalizeFirstLetter(val)  + "\"]";
		});
		eval(jsonAccess);
	    }
	} else {
	    if (propertyArray.length === 1) {
		json[capitalizeFirstLetter(property)] = value;
	    } else {
		// Eval workaround to access json on specified position
		jsonAccess = "json";
		$.each(propertyArray, function(index, val) {
		    jsonAccess += "[\"" + capitalizeFirstLetter(val)  + "\"]";
		});
		jsonAccess += " = value";
		eval(jsonAccess);
	    }
	}
    } else {
	if (value.length == 0) {
	    json[capitalizeFirstLetter(property)] = { "@type": value };
	} else {
	    // Eval workaround to access json on specified position
	    jsonAccess = "json";
	    $.each(propertyArray, function(index, val) {
		jsonAccess += "[\"" + capitalizeFirstLetter(val)  + "\"]";
	    });
	    jsonAccess += " = { \"@type\": value }";
	    eval(jsonAccess);
	}
    }
    
    // Render JSON
    $("#json-ld-col").text(JSON.stringify(json, undefined, 4));
}
