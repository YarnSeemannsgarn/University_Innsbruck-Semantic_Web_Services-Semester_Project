/*
 *
 *
 * We will create schema class using extend function
 *
 *
 */

function Schema(obj)
{
     $.extend(this, obj);    
}


Schema.prototype.callMeMaybe = function(){
    console.log(this);
}



/*
 *
 *
 * Loading schema.org objects from jsonld
 *
 *
 */
$.getJSON('/../src/schema/tree.jsonld', {format: "json"}, function( json ) {
    	
    	var schema = new Schema(json);
    	schema.callMeMaybe();
    	
  	})
  	.fail(function( jqxhr, textStatus, error ) {

  		alert("unable to load jsonld!");
});
