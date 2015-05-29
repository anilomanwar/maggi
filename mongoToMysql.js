var elasticsearch = require('elasticsearch'),
dbUtil=require("./lib/dbUtils");
var SoCategories=require("./lib/SosCategories"),
async= require('async'),
//cawlConfig=require('./scripts/pepperfry_mongo'),
cawlConfig=require('./scripts/fabfurnish'),
_ = require("underscore"),
fs=require("fs");
var db=  new dbUtil();
var mongoUtil=require("./mongoUtil");
var SCategories=new SoCategories();
var dumpConfig,client;
var startpt=0;
var totalMatchcount=0,
inc=500;
var indexarr=[],
mcid=0;
var statusToPick=0;
 var objmongoutil;
function dumpIntoDB(cawlConfig)
{
 dumpConfig=cawlConfig;
 objmongoutil = new mongoUtil('54.66.169.163','sos',"fabfurnish",cawlConfig.mongoose_schema);
 SCategories.getCategoriesMap();
 db.initDB(dumpConfig);
getPagedData(startpt);
}

function getPagedData(count){
	/* if(count >= maxitems)
		return totalMatchcount; */		
	//get total count of documents	
	objmongoutil.documentCount(statusToPick).
	then(function(count){
		var totalRecords=count;
		console.log("totalRecords=========="+totalRecords)
		var pages=Math.ceil(totalRecords/inc);
		var pageArray=_.range(1,pages);
		console.log(pageArray);
		//get data from mongo in async
		async.eachLimit(pageArray,1,function(page,callback){
			//Get data from mongo.
			objmongoutil.findAllDocument(page,inc,statusToPick)
			.then(function(rawDataArray){
		//	 console.log(rawDataArray)
				//Success function of findAllDocument;
				var processedRrcords=[];
					for(var i=0;i<rawDataArray.length;i++){
						var rawRecord=getCleanedItem(rawDataArray[i]._doc);
				//	console.log(rawRecord);
				if(rawRecord.title!=null)
						if(rawRecord.categoryID!=null && rawRecord.title!=null && rawRecord.price >0){
							var record=[];				
							record.push(rawRecord.url);
							record.push(rawRecord.categoryID);
							record.push(rawRecord.price);
							record.push(rawRecord.title);
							record.push(rawRecord.image);// && item.image.length>0)?item.image[0]:item.image);
							record.push("http://codenlogic.com/project/sos/wp-content/themes/sos/SiteLogos/"+dumpConfig.siteName+"_logo.png");
							record.push(rawRecord.details);
							record.push(dumpConfig.siteName);			
							if(record.length>0)
								processedRrcords.push(record);
						}				
					}
					if(processedRrcords.length>0)
					 db.insertData(processedRrcords);
					callback();
				},function(err){
				//error function forfindallDocument
			});				
		},function(err){
			//Call back of asyncLimit			
		})		
	},function(err){
		//Error function of documentCount
	});		
}


function getCleanedItem(item)
{
 
 if(item!=null )//&& typeof(item.url) != "undefined" && typeof(item.title) != "undefined")
 {
 // Cleaning for prie
 var price;
 if(item.price!=null)
  price=item.price;
 else if(item.pricex!=null)
  price=item.pricex;
  if(price!=null)
  {
  // console.log(price);
  while(price.indexOf(",")>0)
    price=price.replace(",","");
  while(price.indexOf("Rs. ")>0)
    price=price.replace("Rs. ","");
 item.price=price;
  }
 // Cleaning for Image
 if(item.image!=null && Array.isArray(item.image))
  {
    item.image=item.image[0];
  }
 
 
  // Cleaning for Image
 if(item.details!=null && Array.isArray(item.details))
  {
    item.details=item.details.toString();
  }
 
  // Cleaning for Category
   if(item!=null && item.category!=null)
   {
	   if(!Array.isArray(item.category))
		 {
		  var categorys=item.category;
		  
		  // added for preeerfry
		  categorys=categorys.replace("You Are In:","");
		  var sep="/";
		  var carr=categorys.split(sep);
		  item.category=carr;
		 }
	  
		var catid=null; var mcat=null;
		  for (var i=item.category.length-1;i>=0;i--)
		   {
			 catid=SCategories.getCategoryID(item.category[i],item.category.toString());
			 if(catid!=null)
			 {
			   mcat=item.category[i];
				break;
			 }
		   }// for loop end
		if(catid!=null)
		   {
			   item.categoryID=catid.CatID;
			   mcid++
		   }
    }
   console.log("product"+item.url);
 }
 else
 {
   console.log("no product");
 }
 
 return item;
 
}
dumpIntoDB(cawlConfig);



















/* function getpagedData(esi){
if(esi>=maxitems)
return totalMatchcount;
client.search({
  index: dumpConfig.indexName,//"pepperfry1"
  type: 'test',
  body: {
    query: {"match_all":{}},
            "from" : esi,
            "size" : inc 
           }
      }).then(function (resp) {

    var hits = resp.hits.hits;
     var ps=[];
     mcid=0;
     if(esi==startpt)
        maxitems=resp.hits.total;
        
    for(var j=0; j<hits.length; j++) {
             var item=hits[j]._source;
                item=getCleanedItem(item);
         if(item.categoryID!=null&&item.title!=null && item.price >0)
            {      
            var ls=[];
            ls.push(item.url);
            ls.push(item.categoryID);
            ls.push(item.price);
            ls.push(item.title);
            ls.push(item.image);// && item.image.length>0)?item.image[0]:item.image);
            ls.push("http://codenlogic.com/project/sos/wp-content/themes/sos/SiteLogos/"+dumpConfig.siteName+"_logo.png");
            ls.push(item.details);
            ls.push(dumpConfig.siteName);
            ps.push(ls);
             fs.appendFile('logs/matchedCategories_'+dumpConfig.siteName+'.txt',item.category+": mapped to --> "+item.categoryID+"  URL--> ("+item.url+')\n', function (err) {
                      if (err) throw err;
              });
            }
       else
        fs.appendFile('logs/unmatchedCategories_'+dumpConfig.siteName+'.txt',item.category+": mapped to --> "+item.categoryID+"  URL--> ("+item.url+')\n', function (err) {
                      if (err) throw err;
              });
    }// for each hit
    if(ps.length>0)
     db.insertData(ps);
      totalMatchcount+=mcid
       console.log(esi +" matched-> "+mcid +"  total  ->  "+totalMatchcount);
    getpagedData(esi+inc)
    }, function (err) {
    console.trace(err.message);
  });
} */// for each 100 products
