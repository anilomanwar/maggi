var xml2object = require('xml2object');
var fs=require('fs');
var source = fs.createReadStream('./out/1m7_2014-10-26_1.xml');

// Create a new xml parser with an array of xml elements to look for
var parser = new xml2object([ 'loc' ], source);
var linkArr=[]
// Bind to the object event to work with the objects found in the XML file
parser.on('object', function(name, obj) {
    console.log('Found an object: %s', name);
    linkArr.push(obj['$t'])
   // console.log(obj);
});

// Bind to the file end event to tell when the file is done being streamed
parser.on('end', function() {
    console.log('Finished parsing xml!');
    console.log(linkArr.length)
    fs.writeFile('./out/1m7_2014-10-26_1.txt',JSON.stringify(linkArr))
});

// Start parsing the input stream
parser.start();