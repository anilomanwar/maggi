var mongoose = require('mongoose');

var fs=require('fs')
var mongoosePaginate = require('mongoose-paginate');
var q=require('q');

var mongoUtil = function(hostname,dbName, modelName, schema){
	var mongo=this;
	mongoose.connect('mongodb://'+hostname+'/'+dbName);
	
	mongo.sitemapSchema=mongoose.Schema({
    loc: {type:String,unique:true},
	lastmod : Date,
	depth : Number,
	created_at: { type: Date, default: Date.now },
	process_status :{type:Number, default:0}
})
	mongo.urlSchema=mongoose.Schema({
    loc: {type:String,unique:true},
	lastmod : Date,
	depth : Number,
	created_at: { type: Date, default: Date.now },
	process_status :{type:Number, default:0}
})
	mongo.dataSchema=mongoose.Schema({
    url: {type:String,unique:true},
	created_at: { type: Date, default: Date.now },
	process_status :{type:Number, default:0}
},{strict:false})

	mongo.sitemapSchema.plugin(mongoosePaginate)
	mongo.objSiteMapModel=mongoose.model('sitemap_'+modelName,mongo.sitemapSchema)
	
	mongo.urlSchema.plugin(mongoosePaginate)
	mongo.objUrlModel=mongoose.model('url_'+modelName,mongo.urlSchema)
	
	
	mongo.dataSchema.plugin(mongoosePaginate)
	mongo.objDataModel=mongoose.model('data_'+modelName,mongo.dataSchema)
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
		deferred.resolve()
    } else {
	deferred.resolve()
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}
return deferred.promise;
}

mongoUtil.prototype.insertData=function(data){
var mongo = this;
var deferred = q.defer();
mongo.objDataModel.create(data, onInsert);

function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
		deferred.resolve()
    } else {
	deferred.resolve()
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}
return deferred.promise;
}


mongoUtil.prototype.findAllUrl=function(iterator,pagesize,status,callback){
var mongo = this;
var deffered= q.defer()
mongo.objUrlModel.paginate({"process_status":status}, iterator, pagesize, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
	deffered.resolve(paginatedResults)
  } else {
console.log('Pages:', iterator);
console.log(pageCount);
	deffered.resolve(paginatedResults)
	if(callback)
	callback(paginatedResults)
  }
});
return deffered.promise;
}


mongoUtil.prototype.findAllDocument=function(iterator,pagesize,status,callback){
var mongo = this;
var deffered= q.defer()
mongo.objDataModel.paginate({"process_status":status}, iterator, pagesize, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
	deffered.resolve(paginatedResults)
  } else {
console.log('Pages:', iterator);
console.log(pageCount);
//console.log(paginatedResults)
	deffered.resolve(paginatedResults)
	if(callback)
	callback(paginatedResults)
  }
});
return deffered.promise;
}

mongoUtil.prototype.urlCount=function(status,callback){
	var deferred=q.defer();
	var mongo=this;
	mongo.objUrlModel.count({"process_status":status},function(err,count){
		deferred.resolve(count)
		if(callback)
		callback(count);
		})
	return deferred.promise
}

mongoUtil.prototype.documentCount=function(status,callback){
	var deferred=q.defer();
	var mongo=this;
	mongo.objDataModel.count({"process_status":status},function(err,count){
		deferred.resolve(count)
		if(callback)
		callback(count);
		})
	return deferred.promise
}

mongoUtil.prototype.updateProcessingStatus = function updateProcessingStatus(idArr,status){
var deferred=q.defer();
var mongo=this;
//var bulk = mongo.objUrlModel.collection.initializeOrderedBulkOp();
//    bulk.find({'_id': {$in: idArr}}).update({$set: {process_status: 2}});
//    bulk.execute(function (error) {
    mongo.objUrlModel.update({'_id': {$in: idArr}},{$set: {process_status: status}},{multi:true},function(){
        
	deferred.resolve('updated')
})
		//if(!error)
       //  console.log('updated')                   
  //  });
	return deferred.promise
}

mongoUtil.prototype.updateStatusOfAll = function(status){
    var mongo=this;
mongo.objUrlModel.update({}, {$set: {process_status: status}}, {multi: true}, function(err) { 
    if(!err)
        console.log('all updated')
        });
}

mongoUtil.prototype.renameCollection = function renameCollection(oldName, newName){
	var mongo=this;
	mongoose.connection.db.renameCollection(oldName,newName, function(err,result){
		if(!err) (
            console.log("renamee")
        )
		else console.log(err)
	});
	 
}

mongoUtil.prototype.getLastCrawlDate = function (){
    var deferred=q.defer();
	var mongo=this;
    
    mongo.objDataModel.findOne({}).sort({date: 'desc'}).exec(function(err, docs) { 
        if(!err){
            deferred.resolve(docs.created_at)
        }
        else
            deferred.reject(new Error(err))
    });
    return deferred.promise;
}

 module.exports=mongoUtil;
