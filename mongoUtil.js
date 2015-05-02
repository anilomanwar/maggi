var mongoose = require('mongoose');

var fs=require('fs')
var mongoosePaginate = require('mongoose-paginate');

var mongoUtil = function(hostname,dbName, modelName){
	var mongo=this;
	mongoose.connect('mongodb://'+hostname+'/'+dbName);
	
	mongo.sitemapSchema=mongoose.Schema({
    url: String,
	created_at: { type: Date, default: Date.now },
	prosess_status :{type:Number, default:0}
})
	mongo.sitemapSchema.plugin(mongoosePaginate)
	mongo.objModel=mongoose.model(modelName,mongo.sitemapSchema)
}
mongoUtil.prototype.insertSiteMapUrls=function(){
var mongo = this;
var linksArr=JSON.parse(fs.readFileSync('./out/pepperfry_links1.txt'))
var objArr=[];
linksArr.forEach(function(link){
var tmp={}
tmp.url=link
objArr.push(tmp)
})

mongo.objModel.create(objArr, onInsert);

function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
    } else {
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}
}

mongoUtil.prototype.findAll=function(iterator,pagesize,callback){
var mongo = this;
mongo.objModel.paginate({}, iterator, pagesize, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
  } else {
    console.log('Pages:', pageCount);
    //console.log(paginatedResults);
	if(callback)
	callback(paginatedResults)
  }
});
}

mongoUtil.prototype.documentCount=function(callback){
	var mongo=this;
	mongo.objModel.count({},function(err,count){
		console.log(count)
		if(callback)
		callback(count);
		})
}

mongoUtil.prototype.updateProcessingStatus = function (idArr){
var mongo=this;
var bulk = mongo.objModel.collection.initializeOrderedBulkOp();
    bulk.find({'_id': {$in: idArr}}).update({$set: {prosess_status: 1}});
    bulk.execute(function (error) {
		if(!error)
         console.log('updated')                   
    });
}
 module.exports=mongoUtil;
