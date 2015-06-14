var mysql      = require('mysql');
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
     logger.info("insering products : ");
     sql='INSERT INTO '+dbconfig.productsTable+' (url,category,price,name,image,m_logo,description,brand) VALUES ?' //products6
var query = connection.query(sql, [products], function(err, result) {
    // console.log(query);
  if(err)
   logger.error(err );
  else
  {
   logger.info("inserted : "+result.affectedRows);
   console.log("inserted : "+result.affectedRows);
  }
});
}

// for bulk insert use following query
function _insertUpdateData(inserUpadateMap){
     logger.info("insering products : ");
     var str=inserUpadateMap.keys().join(" , ");
     sql= "SELECT * FROM products4 WHERE url IN ("+str+")";
var query = connection.query(sql , function(err, result) {
    console.log(query);
  if(err)
   logger.error(err );
  else
  {
      var processedRrcords=[];
      result.forEach(function(object) {
             inserUpadateMap.remove(object.url);
            //above will be update check
        });
        if(inserUpadateMap.count()>0)
        {
        inserUpadateMap.forEach(function(value, key) {
            processedRrcords.push(value);
         });
         //console.log("Insert count: - "+processedRrcords.length);
         _insertData(processedRrcords);
        }
  }
});
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

