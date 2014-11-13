var request=require('request')
 var fs = require('fs');
request({url:'http://www.flipkart.com/burg-9-smartwatch-men/p/itmdf3h7fhbfrgqp',headers:{'User-Agent':''}}, function (error, response, body) {
       //   if (!error && response.statusCode == 200) {
          //  console.log(body) // Print the google web page.
          fs.writeFile('tmp.html',body)
       //   }
        });