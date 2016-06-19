/*
 * We will create schema class using extend function
 */
function Schema() {}

Schema.prototype.addJSON = function(obj){
    $.extend(this, obj);
}

Schema.prototype.callMeMaybe = function(){
    console.log(this);
}

Schema.prototype.getType = function(type){
    return this.types[type];
}

Schema.prototype.getPropertyDataTypes = function(property) {
    return this.properties[property].ranges;
}
