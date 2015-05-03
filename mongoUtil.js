var mongoose = require('mongoose');

var fs=require('fs')
var mongoosePaginate = require('mongoose-paginate');
var q=require('q');

var mongoUtil = function(hostname,dbName, modelName){
	var mongo=this;
	mongoose.connect('mongodb://'+hostname+'/'+dbName);
	
	mongo.sitemapSchema=mongoose.Schema({
    loc: String,
	lastmod : Date,
	depth : Number,
	created_at: { type: Date, default: Date.now },
	prosess_status :{type:Number, default:0}
})
	mongo.urlSchema=mongoose.Schema({
    loc: String,
	lastmod : Date,
	depth : Number,
	created_at: { type: Date, default: Date.now },
	prosess_status :{type:Number, default:0}
})
	mongo.sitemapSchema.plugin(mongoosePaginate)
	mongo.objSiteMapModel=mongoose.model('sitemap_'+modelName,mongo.sitemapSchema)
	
	mongo.urlSchema.plugin(mongoosePaginate)
	mongo.objUrlModel=mongoose.model('url_'+modelName,mongo.urlSchema)
}
mongoUtil.prototype.insertSiteMapUrls=function(objArr){
var mongo = this;
var deferred = q.defer();
mongo.objSiteMapModel.create(objArr, onInsert);

function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
    } else {
	deferred.resolve()
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}
return deferred.promise;
}

mongoUtil.prototype.insertActualUrls=function(objArr){
var mongo = this;
var deferred = q.defer();
mongo.objUrlModel.create(objArr, onInsert);

function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
    } else {
	deferred.resolve()
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}
return deferred.promise;
}

mongoUtil.prototype.findAll=function(iterator,pagesize,callback){
var mongo = this;
var deffered= q.defer()
mongo.objUrlModel.paginate({}, iterator, pagesize, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
	deffered.resolve(paginatedResults)
  } else {
    console.log('Pages:', iterator);
    //console.log(paginatedResults);
	deffered.resolve(paginatedResults)
	if(callback)
	callback(paginatedResults)
  }
});
return deffered.promise;
}

mongoUtil.prototype.documentCount=function(callback){
	var deferred=q.defer();
	var mongo=this;
	mongo.objUrlModel.count({},function(err,count){
		deferred.resolve(count)
		if(callback)
		callback(count);
		})
	return deferred.promise
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
