var mysql      = require('mysql');
var q=require('q');
var connection,
logger = require("./w-logger");
var sql,dbconfig;
function _initDB(dbConfig){
 connection=  mysql.createConnection({
  host     : dbConfig.DBServer,
  port     : '3306',
  user     : 's_user',
  password : '1q2w3e',
  database  : 'sos'
});
dbconfig=dbConfig;
connection.connect(function(err) {
    if(err)
    
    logger.error("Error: "+JSON.stringify(err))
    else
    logger.info('connected');
});
}
// for bulk insert use following query
function _insertData(products){
	var deferred = q.defer();
     logger.info("insering products : ");
     sql='INSERT INTO '+dbconfig.productsTable+' (url,category,price,name,image,m_logo,description,brand) VALUES ?' //products6
var query = connection.query(sql, [products], function(err, result) {
    // console.log(query);
  if(err)
   logger.error(err );
  else
  {
  deferred.resolve(result.affectedRows);
   logger.info("inserted : "+result.affectedRows);
   console.log("inserted : "+result.affectedRows);
  }
});
return deferred.promise;
}

// for bulk insert use following query
function _insertUpdateData(inserUpadateMap){
	var deferred = q.defer();
     logger.info("insering products : ");
     sql= "SELECT * FROM products4 WHERE url IN (?)";
var query = connection.query(sql,inserUpadateMap.keys() , function(err, result) {
    
  if(err)
   logger.error(err );
  else
  {
      var processedRrcords=[];
      result.forEach(function(object) {
             inserUpadateMap.remove(object.name);
            //above will be update check
        });
        if(inserUpadateMap.count()>0)
        {
        inserUpadateMap.forEach(function(value, key) {
            processedRrcords.push(value);
         });
         //console.log("Insert count: - "+processedRrcords.length);
         _insertData(processedRrcords)
		 .then(function(res){
				deferred.resolve(res);
			},
			function(err){
			//TODO: Error handling
			});
        }
  }
});
return deferred.promise;
}
function _terminateConnection(){
connection.end();
}
var _products=[];
var dbUtil= function(){
  return {
    initDB:_initDB,
    insertData:_insertData,
    terminateConnection:_terminateConnection,
    insertUpdateData:_insertUpdateData
  }
  
}

module.exports = dbUtil;

