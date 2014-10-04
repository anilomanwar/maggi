var noodle = require('./lib/noodle');
var Q           = require('q');
var prepareNoodle = require('./prepareNoodle');
var dbUtil=require("./dbutil");
var db=  new dbUtil();
var reciepe=new prepareNoodle();
var queryArr=require('./scripts/jabong').queryArr;



function processIt(q){

 if(q)
 var noodleQuery=reciepe.handlePagination(q);
 noodleQuery.then(function(result){
     console.log(result);
     processQuery(result.shift(),result);
 })
 
//  processQuery(q);
  
  
}
function processQuery(query,result){
noodle.query(query)
.then(function (results) {
  console.log(JSON.stringify(results.results));
  var data=processResultsBeforeInsert(results)
  db.insertData(data).then(function(rows){
   // processIt(queryArr.shift())
   console.log(rows);
   processQuery(result.shift());
     console.log('done')
  })
  
});
}

 var processResultsBeforeInsert= function(results){
   var insertableArr=[];
   results.results[0].results.product.forEach(function(ele){
     insertableArr.push(ele);
   });
  return insertableArr;
 }

 db.initDB().then(function(){
   processIt(queryArr.shift());
 });