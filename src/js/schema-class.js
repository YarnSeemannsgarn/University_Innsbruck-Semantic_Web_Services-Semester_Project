function Schema(obj) // CONSTRUCTOR CAN BE OVERLOADED WITH AN OBJECT
{
   
    this.print = function() {return this.a*this.b;};

    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
    for (var prop in obj) this[prop] = obj[prop];
   
   
   this.print = function (obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    alert(out);

    // or, if you wanted to avoid alerts...

    var pre = document.createElement('pre');
    pre.innerHTML = out;
    document.body.appendChild(pre)
}


}


var fooObj = new Foo();
alert(fooObj.test() ); //Prints 6

// INITIALISE A NEW FOO AND PASS THE PARSED JSON OBJECT TO IT
var fooJSON = new Foo(JSON.parse('{"a":4,"b":3}'));

alert(fooJSON.test() ); //Prints 12
