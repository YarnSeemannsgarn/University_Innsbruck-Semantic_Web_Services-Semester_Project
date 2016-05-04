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

Schema.prototype.getChildren = function(){
	return this.children;
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
    	console.log(schema.getChildren());
    	
  	})
  	.fail(function( jqxhr, textStatus, error ) {

  		alert("unable to load jsonld!");
});
