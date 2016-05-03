// TODO: Add more fields
function Event() {
    this.name = null;
    this.description = null;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$( "#sel-thing" ).change(function() {
    // Remove precreated input fields
    $(".deleatable").remove();

    // What was selected
    // TODO: make generic
    if ($( "#sel-thing option:selected" ).text() == "Event") {
	var event = new Event();
	for (var attribute in event) {
	    $("#container").append("<div class=\"form-group deleatable\"><label for=\"" + attribute + "\">" + capitalizeFirstLetter(attribute) + ":</label><input type=\"text\" class=\"form-control\" id=\"" + attribute + "\"></div>");
	}
    }
});


