'use strict'

var PubNub = require('pubnub')
var config = require('../config.json')
var UID = require('./uid.js')

if (!config.subscribeKey) {
	console.error('"subscribeKey" must be defined in the config.json')
}

var service = module.exports
var pubnub = new PubNub({
	subscribeKey: String(config.subscribeKey),
	publishKey: String(config.publishKey),
	cipherKey: String(config.cipherKey),
	logVerbosity: Boolean(config.logVerbosity),
	uuid: UID,
	ssl: Boolean(config.ssl)
})


service.subscribe = function (/*channelName*/) {
	var channels = Array.prototype.slice.call(arguments, 0)
	pubnub.subscribe({
		channels: channels
		//withPresence: true // also subscribe to presence instances.
	})
}

service.listen = function (channel, handler) {
	var listener = {
		message: function (event) {
			// handle message
			var channelName = event.actualChannel; // Channel Name if from channel group
			var channelGroup = event.subscribedChannel; // Channel Group if from channel group
			var pubTT = event.timetoken; // Publish timetoken
			var msg = event.message; // The Payload

			if(channel === event.channel) {	
				handler(msg)
			}
		},
		presence: function (event) {
			// handle presence
			var action = event.action; // Can be join, leave, state-change or timeout
			var channelName = event.actualChannel; // Channel Name if from channel group
			var occupancy = event.occupancy; // No. of users connected with the channel
			var state = event.state; // User State
			var channelGroup = event.subscribedChannel; // Channel Group if from channel group
			var publishTime = event.timestamp; // Publish timetoken
			var timetoken = event.timetoken;  // Current timetoken
			var uuid = event.uuid; // UUIDs of users who are connected with the channel
		},
		status: function (event) {
			// handle status
		}
	}
	pubnub.addListener(listener)
	return listener
}

service.publish = function (channelName, message) {
	return new Promise(function(resolve, reject){
		pubnub.publish(
			{
				message: message,
				channel: channelName,
				sendByPost: false, // true to send via post
				storeInHistory: false, //override default storage options
				meta: {  } // publish extra meta with the request
			},
			function (status, response) {
				 if (status.error) {
					reject(new Error(status))
				} else {
					resolve(response && response.timetoken)
        		}
			}
		)
	})
}







