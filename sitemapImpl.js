var Crawler = require("./lib/crawlingImpl");
var url = require('url');
var _=require('underscore')
var es=require("./estest");
var fs=require('fs')
var q= require('q')
var query;
var logger = require("./lib/w-logger");
 

var qhasDrained=false
var c;
function processQuery($,query){
    logger.info('Processing to structure the data')
    var tmpObj= {};
    tmpObj.url=query.url
    try{
   _(query.map).map(function(item,key){ 
       tmpObj[key]=arrExtractor($,item)
   })
    }
    catch(err){
        console.log(err)
    }
   return tmpObj
}
function arrExtractor($,obj){
var property=obj.extract,
    selector=obj.selector;
    opArrr=[];
    $(selector).each(function(i){
        opArrr.push(extractData($,this,obj))
    })
    if(opArrr.length>1)
        return opArrr
    else
        return opArrr[0]
}
function extractData($,ele,obj){
    var property=obj.extract,
        selector=obj.selector;
if (property === 'text') {
    return $(ele).text().replace(/(\r\n|\n|\r|\t)/gm, "").trim();
  }
  else if (property === 'html' || property === 'innerHTML') {
    return $(ele).html();
  }
  else {
    return $(ele).attr(property);
  }
}
exports.startCrawling=function(linksArr,objquery,xmlName){
   var deferred=q.defer();
    query=objquery
c = new Crawler({
    maxConnections : 10,
    userAgent:'request',
    onDrain:function(){
     logger.warn('Cque is drained')
    deferred.resolve()
    },
    callback : function (error, result, $) {
        if(error){
            logger.fatal("data not crawled"+JSON.stringify(result))
          
        }
        else{
            logger.info("Data crawled for uri"+result.uri)
            query.url=result.uri;
             var processedData= processQuery($,query)
             es.client.create({index: 'fl-index-'+xmlName,
                  type: 'test',
                body:processedData},function(){
                 logger.info("data is inserted in the index")
                 
                 
                })
        }
    }
});
c.queue(linksArr); 
  return deferred.promise; 
}
exports.killInstance=function(){
delete c;
}