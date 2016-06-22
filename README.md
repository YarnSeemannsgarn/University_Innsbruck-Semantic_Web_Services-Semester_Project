This JSON-LD generator can generate valid JSON-LD for [schema.org](http://schema.org/) types.

Setup
=====

Nothing. Just open the [index.html](src/index.html) and enjoy the generator :)

How does it work?
=================

The generator takes inputs of the user and generates the JSON-LD by using the [schema.json](schema/schema.json) file, which contains all schema.org datatypes, properties and types. For the dynamic form and the JSON-LD generation the [json-ld-generator.js](js/json-ld-generator.js) file is responsible. The core is a recursive function which itself includes adding event handlers for newly generated fields.