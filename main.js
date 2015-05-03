var utili=require('./utility')
var esUtil=require('./esUtil')
var mongoutil=require("./mongoUtil");



var cawlConfig=require('./scripts/fabfurnish.json')


utili.getLinks(cawlConfig.sitemap.siteMapUrl,cawlConfig.sitemap.level).then(function(linkArr){
var objmongoutil = new mongoutil('localhost','sos',cawlConfig.sitemap.model);
    //if(cawlConfig.sitemap.level==1)
    objmongoutil.insertSiteMapUrls(linkArr)
       
    // else if(cawlConfig.sitemap.level==2) 
    // processLevel2(linkArr.shift())
    
    
})

function processLevel2(link,linkArr){
    
        utili.getLinks(link.url).then(function(linkArr1){
    esUtil.insertSiteMap(linkArr1,cawlConfig).then(
            function(){
                processLevel2(linkArr.shift())
            }
        ).fail( function(){
                processLevel2(linkArr.shift())
            })
    
})
        
}