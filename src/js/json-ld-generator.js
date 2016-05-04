$("#sel-thing").change(function ()
{
	// Remove precreated input fields
	$(".deleatable").remove();
	// What was selected
	// TODO: make generic
	if ($("#sel-thing option:selected").text() == "Event")
	{
		var event = new Event();
		for (var attribute in event)
		{
			$("#container").append("<div class=\"form-group deleatable\"><label for=\"" + attribute + "\">" + capitalizeFirstLetter(attribute) + ":</label><input type=\"text\" class=\"form-control\" id=\"" + attribute + "\"></div>");
		}
	}
});




/*
 *
 *
 * Loading schema.org objects from jsonld on webpage start
 *
 *
 */
$.getJSON('/../src/schema/tree.jsonld', {
	format: "json"
}, function (json)
{
/**
   creating Schema from received json
**/
	var schema = new Schema(json);
/**
   getting childrens from schema, childrens are subclases of schema
**/
	types = schema.getChildren();
/**
   creating list of options based on schema types
**/
	Form.createList(types);


}).fail(function (jqxhr, textStatus, error)
{
	alert("unable to load jsonld!");
});