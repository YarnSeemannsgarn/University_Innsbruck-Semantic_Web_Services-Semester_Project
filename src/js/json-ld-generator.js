// TODO: Add more fields
function Event() {
    this.name = null;
    this.description = null;
}

$( "#sel-thing" ).change(function() {
    // Remove precreated input fields
    $(".input-field").remove();

    // What was selected
    // TODO: make generic
    if ($( "#sel-thing option:selected" ).text() == "Event") {
	var event = new Event();
	for(var propt in event){
	    $("#container").append("<input type=\"text\" class=\"form-control input-field\">");
	}
    }
});


