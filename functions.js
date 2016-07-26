'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs')
const app = express()
const TOKEN = process.env.FB_TOKEN

app.set('port', (process.env.PORT)|| 3000)
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

// This finds or creates a user given its facebook ID
function findOrCreateUser(facebookId) {
  var promise = new Promise(function(resolve, reject) { //both are functions
    User.findOne({facebookId: facebookId})
      .then(function(user) { //if there is a user
        if (user) {
          resolve(user); //what is resolve
        } else { //if there is not yet a user
          user = new User({facebookId: facebookId});
          user.save().then(resolve).catch(reject);
        }
      })
      .catch(reject); //if there is an error
  });
  return promise;
}

//retrieve content from backstitch
// function retrieveMediaContent(topic){
//   return new Promise(function(resolve, reject){
//     function callback(error, response){
//       var topicTokens ={funny:'aca1810034a40134947a0242ac110002'}
//       request({
//         url:"https://api.backstit.ch/v2/topics/"+topicTokens[user.topic]+"/results",
//         headers: {
//           "Accept": "application/json"
//         },
//         method: 'GET'
//       }, function(error, response, body){
//         if(response.statusCode==200 && !error){
//           var result = body[0]
//           if(result ==="article"){
//             resolve(result.origin.url);
//           }
//           else{
//             return error;
//           }
//         }
//         else{
//           return error;
//         }
//       })
//     }
//   })

// }

//setTextMessages sends messages in an array
var sendTextMessages = function(resp) {
  return new Promise(function(resolve, reject) {
    function callback(error, response) {
      if (error) {
        reject(error);
      } else if (response && response.body && response.body.error) {
        reject(response.body.error);
      } else if (resp.messageSend.length) {
        var message = resp.messageSend[0];
        resp.messageSend = resp.messageSend.slice(1);
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: TOKEN},
          method: 'POST',
          json: {
            recipient: {id: resp.user.facebookId},
            message: {
              text: message
            }
          }
        }, callback);
      } else {
        resolve(resp);
      }
    }
    callback(); //first time calling the callback
  });
}

//sendButton handles messages that contains a button
function sendButton(resp) {
  return new Promise(function(resolve, reject) {
    var messageData = resp.messageSend;
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: TOKEN},
      method: 'POST',
      json: {
        recipient: {id: resp.user.facebookId},
        message: messageData
      }
    }, function(error, response, body) {
        if (error) {
            console.log('Error in sendButton ', error)
        } else if (response.body.error) {
            console.log('Error from response.body.error in sendButton', response.body.error)
        } else {
          resolve(resp)
        }
    })
  })
}

//sendVideo takes resp, url, text to send a video
function sendVideo(resp, url, text) {
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
          "type": "video",
          "payload": {
            "url": url
          }
      }
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: TOKEN},
      method: 'POST',
      json: {
        recipient: {id: resp.user.facebookId},
        message: messageData
      }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
        //this is the callback and pass down resp
          resolve(resp)
        }
    })
  })
}

//yploadVideo takes resp, path, text to upload a video
function uploadVideo(resp, path, text) {
  resp.messageSend = [text]
  return sendTextMessages(resp)
  .then(function(resp) {
    return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
          "type": "video",
          "payload": {}
      }
    }
    var formData = {
      recipient: '{"id":' + resp.user.facebookId + '}',
      message: '{"attachment":{"type":"video", "payload":{}}}',
      filedata: fs.createReadStream(path)
    }
    request.post({
      url: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + TOKEN,
      formData: formData
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
          reject(response.body.error);
        } else {
          resolve(resp)
        }
    })
  })

    // fs.createReadStream(path).pipe(
    //   request.post({
    //   url: 'https://graph.facebook.com/v2.6/me/messages',
    //   qs: {access_token: TOKEN}
    // }, function(error, response, body) {
    //     if (error) {
    //         console.log('Error sending messages: ', error)
    //         return reject(error);
    //     } else if (response.body.error) {
    //         console.log('Error: ', response.body.error)
    //         return reject(response.body.error);
    //     } else {
    //     //this is the callback and pass down resp
    //       console.log("Body of response:", body);
    //       resolve(resp)
    //     }
    // }))
    // .form();
    // form.append('file', fs.createReadStream(path));
  })
}

//sendMorningRoutine creates a message with multiple buttons of the tasks/routines in the array
function sendMorningRoutine(resp, arr, text, buttonTitle1, buttonTitle2) {
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            // "text": text,
            "elements": []
        }
      }
    }
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      // "http://blog.myvirtualyoga.com/wp-content/uploads/2015/02/meditation-pose-drawing.jpg","http://workoutlabs.com/wp-content/uploads/watermarked/Wide_Pushup1.png","http://cdn.imgs.steps.dragoart.com/how-to-draw-tea-tea-step-4_1_000000075607_3.jpg"
      var el = {
        "title": element.routine,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": imgArr[i % imgArr.length],
        "buttons": [{
          'type': 'postback',
          'payload': buttonTitle1 + element.routine,
          'title': buttonTitle1
        },{
          'type': 'postback',
          'payload': element.routine,
          'title': buttonTitle2
        }]
      }
      messageData.attachment.payload.elements.push(el)
    })
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:TOKEN},
        method: 'POST',
        json: {
            recipient: {id: resp.user.facebookId},
            message: messageData,
        }
      }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
          resolve(resp)
        }
    })
  })
}

function sendTopicButtons(resp, arr) {
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": []
        }
      }
    }
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      var el = {
        "title": element,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": "https://source.unsplash.com/category/nature",
        "buttons": [{
          'type': 'postback',
          'payload': element,
          'title': "Select"
        }]
      }
      messageData.attachment.payload.elements.push(el)
    })
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:TOKEN},
        method: 'POST',
        json: {
            recipient: {id: resp.facebookId},
            message: messageData,
        }
      }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
          resolve(resp)
        }
    })
  })
}

//sendButtons creates a message with multiple buttons of the tasks/routines in the array
function sendButtons(resp, arr, buttonArray) {
  console.log(buttonArray);
  return new Promise(function(resolve, reject) {
    var messageData = {
      "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": []
        }
      }
    }
    var imgArr = ['https://source.unsplash.com/category/nature','https://source.unsplash.com/category/objects','https://source.unsplash.com/category/food','https://source.unsplash.com/category/buildings','https://source.unsplash.com/category/people','https://source.unsplash.com/category/technology'];
    arr.forEach(function(element, i) {
      console.log("Ethan Debug", element.routine);
      var el = {
        "title": element.routine,
        //images displaying in the routine menu
        "image_url": imgArr[i % imgArr.length],
        buttons: buttonArray.map((button) => {
            return {
              type: 'postback',
              title: button.title,
              payload: button.payload + i
            }
        })
      }
      messageData.attachment.payload.elements.push(el)
    })
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:TOKEN},
        method: 'POST',
        json: {
            recipient: {id: resp.user.facebookId},
            message: messageData,
        }
      }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        } else {
          resolve(resp)
        }
    })
  })
}

function checkForMenu(user, messageReceived) {
  var ret = null;
  if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP") {
    if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
    user.state = 100;
      ret = {
        user,
        messageSend: ["Your current wake up time is " + user.timeToWakeUp.time + ". What time do you want it to be?"] //fix
      }
    } else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_CITY") {
      if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 101;
      ret = {
        user,
        messageSend: ["Your current city is " + user.city + ". Which one do you want it to be?"]
      }
    } else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_ROUTINES") {
      if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 102;
      ret = {
        user,
        messageSend: ["Your current routine is:"]
      }
    } else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_MESSAGE") {
      if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 104;
      ret = {
        user,
        messageSend: ["Your message frequency is every " + user.frequency + " hours. What do you want it to be?"]
      }
    } else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION") {
      if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 105;
      console.log("USERRRRRR", user)
      console.log("USERRRRRR.reflectionTime", user.reflectionTime)
      ret = {
        user,
        messageSend: ["Your current reflection time is " + user.reflectionTime.hour + ". What time do you want it to be?"]
      }
    }
    return ret;
}

module.exports = app;
