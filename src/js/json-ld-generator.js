// Enable materialize selects
$(document).ready(function() {
    $('select').material_select();
});
        
/*
 * Loading schema.org objects from jsonld on webpage start
 */
var schema = new Schema();
$.getJSON('./../src/schema/schema.json', {format: "json"}, function (json) {
    /**
       creating Schema from received json
    **/
    
    schema.addJSON(json);
    //console.log(Schema);
    /**
       getting childrens from schema, childrens are subclases of schema
    **/
    //types = schema.getType("Event");
    //console.log(types);
    /**
       creating list of options based on schema types
    **/
    //Form.createList(types);
}).fail(function (jqxhr, textStatus, error) {
    alert("unable to load jsonld!");
});


/*
 * Create property input fields when a schema.org thing is selected
 */
$("#sel-thing").change(function () {
    // Remove precreated input fields
    $(".properties-row").remove();

    // Load schema of selected Thing
    var selectedType = $(this).find(":selected").text();
    var type = schema.getType(selectedType);

    // Visualize each property
    $("#properties-col").css("opacity", "0.0");
    $.each(type.properties, function(index, value) {
	// Construct html
	var capitalzedProperty = capitalizeFirstLetter(value);
	var html = "<div class=\"row properties-row input-field\">"
	var dataTypes = schema.getPropertyDataTypes(value);
	if (dataTypes.length > 1) {
	    html += "<div id=\"1 " + value + "\">" +
		"<select class=\"sel-datatype\">" +
		"<option disabled selected>Choose datatype for " + capitalzedProperty + "</option>";
	    $.each(dataTypes, function(indexDatatype, valueDatatype) {
		html += "<option>" + valueDatatype + "</option>";
	    });
	    html += "</select>" +
		"<label>" + 
		capitalzedProperty + ":" +
		"</label>" +
		"</div>";
	} else {
	    html += "<input type=\"text\" id=\"" + value + "\" class=\"property\">" +
		"<label for=\"" + value + "\">" + 
		capitalzedProperty + ":" + 
		"</label>";
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
    $("#properties-col").animate({opacity: 1.0}, 1000);

    // Initial JSON-LD
    var json = { "@context": "http://schema.org",  "@type": selectedType };
    $("#json-ld-col").text(JSON.stringify(json, undefined, 4));

    $(".property").keyup(function(event) {
	propertyChanges($(this).attr('id'), $(this).val());
    });

    $(".sel-datatype").change(function () {
	// Do not consider select wrapper
	if ($(this).hasClass("initialized")) {
	    var parentID = $(this).parent().parent().attr("id");
	    var div = $(this).parent();
	    var selected = $(this).parent().find(":selected").text();
	    var typeInside = schema.getType(selected);
	    var splittedID = parentID.split(" ");
	    var indent = parseInt(splittedID[0]);
	    var property = splittedID.slice(1).join(" ");
	    var col = "<div id=\"test\" class=\"col m" + (12-indent) + " offset-m" + indent + " orange lighten-3\"></div>";
	    div.append(col);

	    var select_html = "";
	    var input_html = "";
	    $.each(typeInside.properties, function(index, value) {
		// Construct html
		var capitalzedProperty = capitalizeFirstLetter(value);
		var dataTypes = schema.getPropertyDataTypes(value);
		if (dataTypes.length > 1) {
		    select_html += "<div class=\"row properties-row input-field\">";
		    select_html += "<div id=\"" + value + "x\">" +
			"<select class=\"sel-datatype\">" +
			"<option disabled selected>Choose datatype for " + capitalzedProperty + "</option>";
		    $.each(dataTypes, function(indexDatatype, valueDatatype) {
			select_html += "<option>" + valueDatatype + "</option>";
		    });
		    select_html += "</select>" +
			"<label>" + 
			capitalzedProperty + ":" +
			"</label>" +
			"</div>";
		    select_html += "</div>";
		} else {
		    input_html += "<div class=\"row properties-row input-field\">";
		    input_html += "<input type=\"text\" id=\"" + value + "x\" class=\"property\">" +
			"<label for=\"" + value + "x\">" + 
			capitalzedProperty + ":" + 
			"</label>";
		    input_html += "</div>";
		}
	    });
	    $("#test").append(select_html);
	    $('select').material_select();
	    $("#test").append(input_html);

	    propertyChanges(capitalizeFirstLetter(property), selected, true);
	}
	
    });
});


/*
 * Create JSON-LD on change
 */
function propertyChanges(property, value, selectChange=false) {
    var jsonText =  $("#json-ld-col").text().trim();
    var json = JSON.parse(jsonText);

    // Set property value in JSON
    if (selectChange === false) {
	if (value.length == 0) {
	    delete json[property];
	} else {
	    json[property] = value;
	}
    } else {
	json[property] = { "@type": value };
    }
    
    // Render JSON
    $("#json-ld-col").text(JSON.stringify(json, undefined, 4));
}
