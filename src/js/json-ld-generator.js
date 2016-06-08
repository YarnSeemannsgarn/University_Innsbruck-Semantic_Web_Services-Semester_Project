var Schema = new Schema();

$("#sel-thing").change(function ()
{
	
	
	// Remove precreated input fields
	$(".deleatable").remove();
	// What was selected
	// TODO: make generic
	var choosen = $("#sel-thing option:selected").text();
	var type = Schema.getType(choosen);
	
		$.each(type.properties, function(key, value) {
			//display the key and value pair
			$("#container").append("<div class=\"form-group deleatable\"><label for=\"" + value + key + "\">" + capitalizeFirstLetter(value) + ":</label><input type=\"text\" class=\"form-control\" id=\"" + value + key + "\"></div>");
				
		});
});
		
		/*
 *
 *
 * Loading schema.org objects from jsonld on webpage start
 *
 *
 */
 
 
$.getJSON('./../src/schema/schema.json', {
	format: "json"
}, function (json)
{
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


}).fail(function (jqxhr, textStatus, error)
{
	alert("unable to load jsonld!");
});
	





