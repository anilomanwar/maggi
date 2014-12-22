var fs=require('fs')
var xmlParser=require('./parseXml')
var xmls=fs.readdirSync('./tmp')
var linksArr=JSON.parse(fs.readFileSync('./out/2oq_2014-10-26_0.txt'))

var EventEmitter = require("events").EventEmitter;
 

var crawler=require('./sitemapImpl')
var query= require('./scripts/Flipkart_SM_Q')
    
var ee = new EventEmitter();
ee.on("someEvent", function () {
    console.log("event has occured");
    crawler.killInstance()
    processXml(xmls.shift())
});

var processXml=function(xmlName){
xmlParser.parser('./tmp/'+xmlName).then(function(result){
crawler.startCrawling(result,query,ee);
});
}

processXml(xmls.shift())




