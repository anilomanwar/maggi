var fs=require('fs')
var linksArr=JSON.parse(fs.readFileSync('./out/2oq_2014-10-26_0.txt'))

var crawler=require('./sitemapImpl')
var query= require('./scripts/Flipkart_SM_Q')
    
crawler.startCrawling(linksArr,query);