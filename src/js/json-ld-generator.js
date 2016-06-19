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
    var choosen = $("#sel-thing option:selected").text();
    var type = schema.getType(choosen);

    // Visualize each property
    $("#properties-col").css("opacity", "0.0");
    var newRow = true;
    $.each(type.properties, function(key, value) {
	if (newRow) {
	    $("#properties-col").append("<div class=\"row properties-row\"></div>");
	}
	newRow = !newRow;
	
	// Add input field
	$(".properties-row").last().append(
	    "<div class=\"col s6\">" +
		"<label for=\"" + value + "\">" + 
		capitalizeFirstLetter(value) + ":" + 
		"</label>" +
		"<input type=\"text\" id=\"" + value + "\" class=\"property\">" +
		"</div>");

	// Add datehandler for dates
	var dataTypes = schema.getPropertyDataTypes(value);
	if (($.inArray("Date", dataTypes) !== -1) ||
	    ($.inArray("DateTime", dataTypes) !== -1)) {
	    var property = $("#" + value);
	    property.pickadate({
		format: 'yyyy-mm-dd', // ISO 8601 due to https://schema.org/Date
		selectYears: true,
		selectMonths: true,
		onClose: function() { 
		    propertyChanges(property);
		}
	    });	 
	};   
    });
    $("#properties-col").animate({opacity: 1.0}, 1000);
    
    // Initial JSON-LD
    var selected = $("#sel-thing option:selected").text();
    var json = { "@context": "http://schema.org",  "@type": selected };
    $("#json-ld-col").text(JSON.stringify(json, undefined, 4));

    $(".property").keyup(function(event) {
	propertyChanges($(this));
    });
});


/*
 * Create JSON-LD on change
 */
function propertyChanges(elem) {
    var jsonText =  $("#json-ld-col").text().trim();
    var json = JSON.parse(jsonText);

    // Set property value in JSON
    var property = elem.attr('id');
    if (elem.val().length == 0) {
	delete json[property];
    } else {
	var text = elem.val();
	json[property] = text;
    }
    
    // Render JSON
    $("#json-ld-col").text(JSON.stringify(json, undefined, 4));
}
