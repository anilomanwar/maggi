
/*var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'dukesofpune.fatcowmysql.com',
  user     : 's_user',
  password : '1q2w3e',
  database  : 'sos'
}); */
//use process.env.PORT=15455;

var mysql      = require('mysql');
var connection;
function _initDB(){
// connection= mysql.createConnection('mysql://sosu:1q2w3e$R@win-plesk10-110.microhosting.in/searchos_sos?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');
  //connection= mysql.createConnection('mysql://sosu:1q2w3e$R@/searchos_sos?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');
 connection=  mysql.createConnection({
  host     : '198.12.73.13',
  port     : '3306',
  user     : 's_user',
  password : '1q2w3e',
  database  : 'sos'
});
console.log("connectingssssssssssssss")
connection.connect(function(err) {
    if(err)
    console.log("Error: "+JSON.stringify(err))
    else
    console.log('connected');
    
   /* else
    {
        console.log('connected');
      connection.query('SELECT * FROM products').
        execute(function(error, rows, cols) {
                if (error) {
                        console.log('ERROR: ' + error);
                        return;
                }
                console.log(rows.length + ' ROWS found');
        });
    } */
    
    
  // connected! (unless `err` is set)
});

}
// for bulk insert use following query

//INSERT INTO products_new (url,category,price,title,image)
function _insertData(products){
//var query = connection.query('INSERT INTO products_new SET ?', products, function(err, result) {
var sql='INSERT INTO products3 (url,category,price,name,image,m_logo,description,brand) VALUES ?' //products6
var query = connection.query(sql, [products], function(err, result) {
  if(err)
  {
   console.log(err );
  // console.log(query);
  }
  else
   console.log("inserted"+result.affectedRows)
});
//console.log(query.sql);
}

//INSERT INTO products_new (url,category,price,title,image)
function _insertEsBulkJson(products){
  
  var ps=[];
  
  // console.log(products);
  if(products.length>0)
  {
  for(var i=0;i<products.length;i++)
  {
    var ls=[];
    
    var product=products[i];
    
    ls.push(product.url);
    ls.push(product.categoryId);
    ls.push(product.price);
    ls.push(product.title);
    ls.push(product.image);
    ls.push(product.logo);
    ls.push(product.details);
    ls.push(product.brandName);
    
    ps.push(ls);
    
  }
   this.insertData(ps);
  }
}

//url,category,price,name,image,m_logo,description,brand
function _insertBulkJson(products){
  
  var ps=[];
  
if(products.length > 0)
{
  for(var i=0;i<products.length;i++)
  {
    var ls=[];
    
    var product=products[i];
    if(product.price > 0)
    {
   //   console.log("product.price"+product.price);
    ls.push(product.url);
    ls.push(product.categoryId);
    ls.push(product.price);
    ls.push(product.title);
    ls.push(product.image);
    ls.push(product.logo);
    ls.push(product.details);
    ls.push(product.brandName);
    ps.push(ls);
    }
    
  }
   if(ps.length > 0)
  this.insertData(ps); 
  
  console.log("Data pusing -"+ps.length)
}

}// function end

function _terminateConnection(){
connection.end();
}
var _products=[];
var dbUtil= function(){


  
  return {
    initDB:_initDB,
    insertData:_insertData,
     insertBulkJson:_insertBulkJson,
    terminateConnection:_terminateConnection
    
  }
  
}

module.exports = dbUtil;

