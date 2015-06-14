
//use process.env.PORT=15455;

var mysql      = require('mysql');
var connection;
function _initDB(){
 connection=  mysql.createConnection({
  host     : '198.12.73.13',
  port     : '3306',
  user     : 's_user',
  password : '1q2w3e',
  database  : 'sos'
});
connection.connect(function(err) {
    if(err)
    console.log("Error: "+JSON.stringify(err))
   else
    {
        console.log('connected');
        var arr=['http://www.fabfurnish.com/Fab-Home-Tirana-King-Bed-With-Hydraulic-Storage-Wenge-And-White-50585.html','http://www.pepperfry.com/elysia-yarn-dyed-brown-bathmat-1028497.html'];
    var qr="SELECT * FROM products4 WHERE url IN (?)";
          connection.query(qr,arr, function(err, rows, fields) {
              if(err)
               console.log(err)
              else
               console.log(rows)
            });
    /*   connection.query('SELECT COUNT(*) FROM products4', function(err, rows, fields) {
              if(err)
               // console.log(err)
              else
               console.log(rows)
            });
            */
            
    
    } 
    
    
  // connected! (unless `err` is set)
});

}
_initDB();