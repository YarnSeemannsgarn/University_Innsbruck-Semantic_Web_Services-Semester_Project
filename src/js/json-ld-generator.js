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
		"<input type=\"text\" class=\"property\" id=\"" + value +"\">" +
		"</div>");
    });
    $("#properties-col").animate({opacity: 1.0}, 1000);

    // Create JSON-LD on change
    $(".property").keyup(function(event) {
	var selected = $("#sel-thing option:selected").text();
	var jsonLDCol = $("#json-ld-col");
	var jsonText = jsonLDCol.text().trim();
	var json = JSON.parse(jsonText);

	if (jsonText == "{}") {
	    json["@context"] = "http://www.schema.org";
	    json["@type"] = selected;
	}
	
	// Set property value in JSON
	var property = $(this).attr('id');
	if ($(this).val().length == 0) {
	    delete json[property];
	} else {
	    var text = $(this).val();
	    json[property] = text;
	}
	
	// Render JSON
	$("#json-ld-col").text(JSON.stringify(json, undefined, 4));
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
