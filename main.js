var utili=require('./utility')
var esUtil=require('./esUtil')

var cawlConfig=require('.scripts/fabfurnish')


utili.getLinks(cawlConfig.sitemap.siteMapUrl).then(function(linkArr){
    if(cawlConfig.sitemap.level==1)
    esUtil.insertSiteMap(linkArr,cawlConfig)
       
     else if(cawlConfig.sitemap.level==2) 
     processLevel2(linkArr.shift())
    
    
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