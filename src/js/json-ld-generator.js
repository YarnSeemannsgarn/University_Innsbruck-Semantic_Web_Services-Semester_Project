// Enable materialize selects
// Found here: http://stackoverflow.com/questions/28258106/materialize-css-select-doesnt-seem-to-render
$(document).ready(function() {
    $('select').material_select();
});

// Load schema
var Schema = new Schema();

$("#sel-thing").change(function () {
    // Remove precreated input fields
    $(".deleatable").remove();

    // What was selected
    var choosen = $("#sel-thing option:selected").text();
    var type = Schema.getType(choosen);
    $("#left-column").css("opacity", "0.0");
    var newRow = true;
    $.each(type.properties, function(key, value) {
	if (newRow) {
	    $("#left-column").append("<div class=\"row properties-row deleatable\"></div>");
	}
	newRow = !newRow;
	//display the key and value pair
	$(".properties-row").last().append("<div class=\"col s6 form-group\"><label for=\"" + value + key + "\">" + capitalizeFirstLetter(value) + ":</label><input type=\"text\" class=\"form-control\" id=\"" + value + key + "\"></div>");
    });
    $("#left-column").animate({opacity: 1.0}, 1000);
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






