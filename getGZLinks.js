var request=require('request')
var fs=require('fs')
var q=require('q')
var xml2object = require('xml2object');

var parser = new xml2object([ 'loc' ]);
function getLinks(sitemapURL){
request({url:sitemapURL, headers:{'User-Agent':'request'}}).pipe(parser.saxStream)
}



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
    fs.writeFile('./out/jewelsouk_links.txt',JSON.stringify(linkArr))
});




getLinks('http://www.jewelsouk.com/sitemap.xml')