$( "#sel-thing" ).change(function() {
    // Remove precreated input fields
    $(".input-field").remove();

    // What was selected
    alert($( "#sel-thing option:selected" ).text() + " was selected");

    // Create input fields 
    // TODO: make generic
    $("#container").append("<input type=\"text\" class=\"form-control input-field\">");
});


