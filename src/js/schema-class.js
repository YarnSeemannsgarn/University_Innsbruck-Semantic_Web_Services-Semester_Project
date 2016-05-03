function Schema(obj) // CONSTRUCTOR CAN BE OVERLOADED WITH AN OBJECT
{
   
    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
	for (var prop in obj)
	{	
	   if (obj.hasOwnProperty(prop)) 
	   {
		   this[prop] = obj[prop];
		}
	}
   
  
}


}




var Schema = new Schema(JSON.parse('{"a":4,"b":3}'));

console.log(Schema);