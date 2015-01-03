var es=require("./estest");

es.client.count({
"index":'1m7_2014-12-16_0.xml'
},function(err, response, status){
console.log(response.count)
}
) 
/*
es.client.search({
"index":'1m7_2014-12-16_0.xml',
"body":{"query":{"match_all":{}},"size":1,"fields":["url"],"sort":[{"_timestamp":{"order":"desc"}}]}
},function(err, response, status){
console.log(response.hits.hits[0].fields.url[0])
}
)*/
