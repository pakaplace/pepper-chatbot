// var Feedly = require 'feedly'

// var f = new Feedly({
//   client_id: feedlyToken,
//   client_secret: feedlySecret,
//   port: 8080
// });

const request = require('request');

const feedlyToken = process.env.FEEDLY_ACCESS_TOKEN
const feedlyUserId = process.env.FEEDLY_USER_ID
// /http://www.engadget.com/rss.xml&count=3
var count = 3;
const mixUrl = 'http://cloud.feedly.com/v3/mixes/contents?streamId='
const streamUrl = 'http://cloud.feedly.com/v3/subscriptions'
var Media = require('./models/models').Media;


// most interestingArticles
new Promise(function(resolve, reject){
	request.get({
			url: streamUrl,
			headers:{
					"Authorization": 'OAuth '+feedlyToken //alt try bearers and oauth as headers
				} 
			},function(error, response, body){
				var body = JSON.parse(body);
				var techUrls = body.map((body)=>{
					if(body.topics.indexOf('tech')!== -1){
						return body.id; //returns 'feed+/+http address of rss/xml'
					}
				})
				var sportsUrls = body.map((body)=>{
					if(body.topics.indexOf('sports')!== -1){
						return body.id
					}
				})
				// var newsUrls = body.map((body)=>{
				// 	if(body.topics.indexOf('news')!== -1){
				// 		return body.id
				// 	}
				// })
				var iconUrls = body.map((body)=>{
					return body.iconUrl
				})
				resolve({tech: techUrls, sports: sportsUrls}) //urls of feeds
			}
		)
}).then(function(urls){
	console.log("REACHED ***", urls)
	for (categoryKey in urls){ //retrieves from each category
		console.log("***CategoryKey", urls[categoryKey])
		console.log('***', categoryKey, urls)
		urls[categoryKey].forEach((url)=>{ //gets link url for each link from feed
			request.get({
				url: mixUrl+url+'&count='+count,
				headers:{
					"Authorization": 'OAuth '+feedlyToken //alt try bearers and oauth as headers
				} 
			},
			function(error, response, body){
				console.log("$$$$$$$$$$$$$$$$$$$$")
				if(error){
					console.log("error,", error)
				}
				var parsedBody = JSON.parse(body);
				console.log("Body", parsedBody)
				if(urls){
					var urls = parsedBody.items.map((body)=>{
						return body.originId
					})
					if(Media.find()){
						Media.findAndModify({},{
							$set:{categoryKey: urls}})
						console.log("Media updated***")
					}
					else{
						var snap = new Media({
							$set:{categoryKey: urls}
						})
						snap.save(function(err){
							if(err){
								console.log("Error in saving new snap***", err)
							}
							else{
								console.log("SUCCESS SAVING NEW SNAP***")
							}

						})
					}
				}
				console.log("done 1")
			})
				console.log("URLS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", urls)
		})
	}	
})
console.log("Done")




