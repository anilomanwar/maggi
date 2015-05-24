var mysql      = require('mysql');
var connection,
logger = require("./w-logger");
var sql;
function _initDB(dbConfig){
 connection=  mysql.createConnection({
  host     : dbConfig.DBServer,
  port     : '3306',
  user     : 's_user',
  password : '1q2w3e',
  database  : 'sos'
});

connection.connect(function(err) {
    if(err)
    
    logger.error("Error: "+JSON.stringify(err))
    else
    logger.info('connected');
});
sql='INSERT INTO '+dbConfig.productsTable+' (url,category,price,name,image,m_logo,description,brand) VALUES ?' //products6
}
// for bulk insert use following query
function _insertData(products){
     logger.info("insering products : ");
var query = connection.query(sql, [products], function(err, result) {
  if(err)
   logger.error(err );
  else
   logger.info("inserted : "+result.affectedRows)
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
    terminateConnection:_terminateConnection
  }
  
}

module.exports = dbUtil;

