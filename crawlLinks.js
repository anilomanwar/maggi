    var fs=require('fs')
    var xmlParser=require('./parseXml')
    var xmls=fs.readdirSync('./tmp')
    var logger = require("./lib/w-logger");
    var linksArr=JSON.parse(fs.readFileSync('./out/caratlane_links.txt'))

    var EventEmitter = require("events").EventEmitter;


    var crawler=require('./sitemapImpl')
    var query= require('./scripts/Caretlane.json')

    
    /* var ee = new EventEmitter();
    ee.on("someEvent", function () {
        logger.info("First File processing completed")
        crawler.killInstance()
        processXml(xmls.shift())
    }); */

    
    
    crawler.startCrawling(linksArr,query).then(function(){
  
    });
     



