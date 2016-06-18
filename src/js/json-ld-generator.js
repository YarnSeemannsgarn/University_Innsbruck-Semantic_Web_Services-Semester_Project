// Enable materialize selects
$(document).ready(function() {
    $('select').material_select();
});

// Load schema
var Schema = new Schema();

// Create property input fields when a schema.org thing is selected
$("#sel-thing").change(function () {
    // Remove precreated input fields
    $(".properties-row").remove();

    // Load schema of selected Thing
    var choosen = $("#sel-thing option:selected").text();
    var type = Schema.getType(choosen);

    // Visualize each property
    $("#left-column").css("opacity", "0.0");
    var newRow = true;
    $.each(type.properties, function(key, value) {
	if (newRow) {
	    $("#properties-col").append("<div class=\"row properties-row\"></div>");
	}
	newRow = !newRow;

	$(".properties-row").last().append(
	    "<div class=\"col s6\">" +
		"<label for=\"" + value + "\">" + 
		capitalizeFirstLetter(value) + ":" + 
		"</label>" +
		"<input type=\"text\" id=\"" + value +"\">" +
		"</div>");
    });
    $("#properties-col").animate({opacity: 1.0}, 1000);

    // Create JSON-LD on change
    $(".properties-row").keypress(function() {
	var selected = $("#sel-thing option:selected").text();
	if ($("#json-ld-col").text().trim() == "{}") {
	   $("#json-ld-col").text(
	       "{\n" +
		   "\t\"@context\": \"http://www.schema.org\"\n" +
		   "\t\"@type\": \"" + selected + "\"\n" +
		   "}"); 
	}
    });
});



/*
 *
 *
 * Loading schema.org objects from jsonld on webpage start
 *
 *
 */
$.getJSON('./../src/schema/schema.json', {format: "json"}, function (json) {
    /**
       creating Schema from received json
    **/
    
    Schema.addJSON(json);
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
