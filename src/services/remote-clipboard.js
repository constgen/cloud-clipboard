var pubnub = require('./pubnub.js')

var service = {
	CHANNEL: {
		COPY: 'clipboard-copy',
		CUT: 'clipboard-cut',
		PASTE: 'clipboard-paste'
	},

	onCopy: function(handler){
		pubnub.listen(service.CHANNEL.COPY, handler)
	},
	onCut: function(handler){
		pubnub.listen(service.CHANNEL.CUT, handler)
	},
	onPaste: function(handler){
		pubnub.listen(service.CHANNEL.PASTE, handler)
	},

	copy: function(data){
		return pubnub.publish(service.CHANNEL.COPY, data)
	},
	cut: function(data){
		return pubnub.publish(service.CHANNEL.CUT, data)
	},
	paste: function(data){
		return pubnub.publish(service.CHANNEL.PASTE, data)
	}
}

pubnub.subscribe(
	service.CHANNEL.COPY, 
	service.CHANNEL.CUT, 
	service.CHANNEL.PASTE
)

module.exports = service



