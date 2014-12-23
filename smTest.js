var fs=require('fs')
var xmlParser=require('./parseXml')
var xmls=fs.readdirSync('./tmp')
var logger = require("./lib/w-logger");
var linksArr=JSON.parse(fs.readFileSync('./out/2oq_2014-10-26_0.txt'))

var EventEmitter = require("events").EventEmitter;
 

var crawler=require('./sitemapImpl')
var query= require('./scripts/Flipkart_SM_Q')
    
var ee = new EventEmitter();
ee.on("someEvent", function () {
    logger.info("First File processing completed")
    crawler.killInstance()
    processXml(xmls.shift())
});

var processXml=function(xmlName){
logger.info("Parsing xml==========="+xmlName)
xmlParser.parser('./tmp/'+xmlName).then(function(result){
logger.info("XML Parsed")
crawler.startCrawling(result,query,ee);
    logger.info("Crawling Started")
});
}
logger.info("First File processing")
processXml(xmls.shift())




