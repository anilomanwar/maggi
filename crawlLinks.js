var mongoutil=require("./mongoUtil");
var cawlConfig=require('./scripts/fabfurnish.json')
var siteMapImpl=require('./sitemapImpl')
var q=require('q')
var crawler = function(modelName){
	var crawlobj=this;
	crawlobj.batchSize=100;
	crawlobj.objmongoUtil=new mongoutil('localhost','sos',modelName);
}

crawler.prototype.getLinks=function(){
	var crawlobj=this;
	var deferred=q.defer();
	crawlobj.objmongoUtil.documentCount().then(function(count){
	var promiseArr=[];
	console.log(count)
		for(var i=0;i<= count/100;i++){
			promiseArr.push(crawlobj.objmongoUtil.findAll(i,100))
		}
		console.log("promice co"+promiseArr.length)
		q.all(promiseArr).then(function (results) {	
			var linkArr=[];
			results.forEach(function(res){
				res.forEach(function(link){
				linkArr.push(link)
				})
				deferred.resolve(linkArr)
			})
			console.log('q all'+linkArr.length)
		}).fail(function(){
		console.log('fail')
		})
		console.log('done')
	}
)
return deferred.promise;
}
crawler.prototype.start=function(linkArr){
	siteMapImpl.startCrawling(linksArr,query).then(function(){
  
    });
	
}

var objcrawler = new crawler('sitemaps')
objcrawler.getLinks();

//crawler.startCrawling(linksArr,query).then(function(){
  
 //   });