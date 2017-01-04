'use strict'
const request = require('request')
const TOKEN = process.env.FB_TOKEN
const prompts = require('./prompts');
//Models
var User = require('./models/models').User;

// findOrCreateUser(facebookId<string>)
// This finds or creates a user given its facebook ID
function findOrCreateUser(facebookId) {
  console.log(facebookId);
  var promise = new Promise(function(resolve, reject) { //both are functions
    User.findOne({facebookId: facebookId})
      .then(function(user) { //if there is a user
        if (user) {
          resolve(user); //what is resolves
        } else { //if there is not yet a user
          user = new User({facebookId: facebookId});
          console.log("Created new facebook ID")
          user.save()
          .then(resolve).catch(reject);
        }
      })
      .catch(reject); //if there is an error
  });
  return promise;
}


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
    console.log("RESP", resp)
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
            // console.log('Error sending messages: ', error)
        } else if (response.body.error) {
          // reject(error); fix
            // console.log('Error: ', response.body.error)
        } else {
        //this is the callback and pass down resp
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

//sendVideo takes resp, url, text to send a video
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
            console.log('Error: ', response.body.error)
            return reject(response.body.error);
        } else {
        //this is the callback and pass down resp
          console.log("Body of response:", body);
          resolve(resp)
        }
    })
    })
  })
}


//sendMultiButton creates a message with multiple buttons of the tasks/routines in the array using gorilla photos
function sendMultiButton(resp, arr, text, buttonTitle1, buttonTitle2) {
  var imageLinks=["https://dl.dropboxusercontent.com/s/xwxy1t1fe19bjg1/Ape2.png",'https://dl.dropboxusercontent.com/s/73he94d4ae7pbsp/Ape3.png', 
  "https://dl.dropboxusercontent.com/s/tw96donzwg7vvdy/Ape4.png?dl=0", "https://dl.dropboxusercontent.com/s/42z9gxhd2ui6nwo/Ape5.png", 
  "https://dl.dropboxusercontent.com/s/rax65cihfxsi2dn/Ape6.png"]
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
    arr.forEach(function(element,i) {
      var el = {
        "title": "Task "+(i+1)+":  "+element,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": imageLinks[i],
        "buttons": [{
          'type': 'postback',
          'payload': element,
          'title': buttonTitle1
        },{
          'type': 'postback',
          'payload': "Add another task" ,
          'title': "Add another task"
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
    var imgArr = ['https://dl.dropboxusercontent.com/s/hlax1kozzgthrsa/Screen%20Shot%202016-08-18%20at%203.41.41%20PM.png','https://dl.dropboxusercontent.com/s/r8z8nwanwlxzv93/Screen%20Shot%202016-08-18%20at%203.43.52%20PM.png','https://dl.dropboxusercontent.com/s/ticuckmvcvfh8rf/Screen%20Shot%202016-08-18%20at%203.42.24%20PM.png'];
    arr.forEach(function(element, i) {
      var el = {
        "title": element,
        // "subtitle": "Element #1 of an hscroll",
        "image_url": imgArr[i % imgArr.length],
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

// sendButton(resp<Object>, arr<Array>, buttonArray<Array>)
//
// sends a carousel of messages w/ buttons to the user
//
// @param: resp<Object>: response object - used for getting the user's facebookId
// @param: arr<Array<String>>: array of strings corresponding to the message for each card
// @param: buttonArray<Array<String|Object>>: array of strings to name the buttons for each card
// @returns: a promise
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
        "title": element,
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
    if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
    user.state = 100;
      ret = {
        user,
        messageSend: ["Your current wake up time is " + user.timeToWakeUp.time + ". What time do you want it to be?"] //fix
      }
    }
     else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_CITY") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 101;
      ret = {
        user,
        messageSend: ["Your current city is " + user.city + ". Which one do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_ROUTINES") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 102;
      ret = {
        user,
        messageSend: ["Your current routine is:"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_MESSAGE") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 104;
      ret = {
        user,
        messageSend: ["Your message frequency is every " + user.frequency + " hours. What do you want it to be?"]
      }
    }
    else if (messageReceived === "DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION") {
      if (user.state < 6) {
      return {
          user,
          messageSend: prompts.ERROR
      }
    } if (user.state < 100) { user.prevState = user.state; } // remember the state you were before opening menu
      user.state = 105;
      ret = {
        user,
        messageSend: ["Your current reflection time is " + user.reflectionTime.hour+":"+user.reflectionTime.minute + ". What time do you want it to be?"]
      }
    }
    return ret;
}

module.exports = {
  findOrCreateUser: findOrCreateUser,
  sendButton: sendButton,
  sendButtons: sendButtons,
  sendMultiButton: sendMultiButton,
  sendTextMessages: sendTextMessages,
  sendVideo: sendVideo,
  uploadVideo: uploadVideo,
  sendMorningRoutine: sendMorningRoutine,
  sendTopicButtons: sendTopicButtons,
  checkForMenu: checkForMenu
}
