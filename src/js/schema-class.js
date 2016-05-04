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


