const request = require('request')
const FAT = process.env.FEEDLY_ACCESS_TOKEN
const NEWS = process.env.NEWS
const TECH = process.env.TECH
const SPORTS = process.env.SPORTS

var News = require('./models/models').News;



var categories = {'news':"user/746c1cb9-cfbd-417d-a56a-dc365a65a4b4/category/News",
                "tech":"user/746c1cb9-cfbd-417d-a56a-dc365a65a4b4/category/Tech", 
                "sports":"user/746c1cb9-cfbd-417d-a56a-dc365a65a4b4/category/sports"
                }

function feedlyOptions(path){
    return {
    url: "https://cloud.feedly.com/v3/streams/contents?streamId="+path,
    auth: {
        'bearer': FAT
        }
    }
} 
function getArticles(path){
    return new Promise(function(resolve, reject){
        console.log("here")
        request.get(feedlyOptions(path), function(err, response, body){
            if(response.statusCode!==200){
                console.log("error requesting news~~~", err)
            }
            else{
                body = JSON.parse(body);
                resolve(
                    body.items
                    .filter(article => article.engagementRate > .1 || article.engagement > 500)
                    .map((filteredNews)=>{
                        if(filteredNews.originId.indexOf('http') === -1){
                            return false;
                        }
                        console.log("news", filteredNews)
                        return {title: filteredNews.title, url: filteredNews.originId}
                    })
                )
            }
        })
    })
    .catch(err=>{
        console.log("error getting articles")
        Promise.reject(err);
    })
}

Promise.all([getArticles(TECH), getArticles(NEWS), getArticles(SPORTS)]) 
.then(newsArrs=>{ //happening before getArticles is finished.

       News.remove(function(err, sucess){
        if(err){
            console.log("ERROR REMOVING", err)
        }
        else{
            new News({
                tech: newsArrs[0],
                news: newsArrs[1],
                sports: newsArrs[2]
            }).save(function(err){
                if(err){
                    console.log("error saving news records", err)
                }
                else{
                    console.log("saved")
                }
            })
            console.log("success")
        }
    })

})
.catch(
    function(err){
        console.log('error', err)
        Promise.resolve(err)
   }
)

News.find(function(err, body){
    if(err){
        console.log("error finding", err)
    }
    else{
        console.log("body yo", body[0])
    }
})


