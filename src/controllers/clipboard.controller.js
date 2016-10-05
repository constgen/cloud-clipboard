'use strict'

var window = require('vendor:window')
var remoteClipboard = require('../services/remote-clipboard.js')

var document = window.document

var controller = {
	data: '',

	hiddenElement: (function(){
		var hiddenElement = document.createElement('textarea')

		
		hiddenElement.oncopy = function(event){
			console.log('hidden element copy: ' + this.value)
			//event.stopPropagation()
		}
		document.body.appendChild(hiddenElement)
		//hiddenElement.style.position = 'absolute'
		//hiddenElement.style.width = '0'
		//hiddenElement.style.height = '0'
		hiddenElement.style.overflow = 'hidden'
		hiddenElement.style.clip = 'rect(0, 0, 0, 0)'
		
		return hiddenElement
	}()),

	getSelectedText: function (){
		// text=document.selection.createRange().text; /// for IE
		// document.selection.createRange().htmlText // IE <= 10 
		return window.getSelection().toString()
	},
	getClipboartData: function(event){
		//EDGE+IE
		// window.clipboardData.getData("Text");
		// window.clipboardData.setData ("Text", input.value);

		// IE
		// event.dataTransfer.getData("Text");
		// event.dataTransfer.setData("URL", oSource.href);

		return event.clipboardData.getData('text/plain') 
			|| event.clipboardData.getData('Text')
			|| event.clipboardData.getData('text/html')
	},

	setClipboardData: function(event, data){
		return event.clipboardData.setData('text/plain', data)
	},

	paste: function(data){
		try {
			// Firefox
			var pasteEvent = new ClipboardEvent('paste', { 
				dataType: 'text/plain', 
				data: data 
			})
			controller.hiddenElement.dispatchEvent(pasteEvent)
		}
		catch (err) {
			console.error(err)
		}
	},

	copy: function(data){
		if (window.clipboardData) { // Internet Explorer
			window.clipboardData.setData("Text", data);
		} else {
			controller.hiddenElement.value = data
			controller.hiddenElement.select()

			try {
				// Firefox
				var copyEvent = new ClipboardEvent('copy', { 
					dataType: 'text/plain', 
					data: data 
				})
				controller.hiddenElement.dispatchEvent(copyEvent)
			}
			catch (err) {
				//console.error(err)
				document.execCommand('copy')
			}

			//controller.hiddenElement.value = ''
		}
	},

	handleCopy: function(event){
		var copiedData = controller.getClipboartData(event) || controller.getSelectedText()
		remoteClipboard.copy(copiedData)
	},
	handleCut: function(event){
		var cutData = controller.getClipboartData(event) || controller.getSelectedText()
		remoteClipboard.cut(cutData)
	},

	handleRemoteCopy: function(data){
		console.info('Copy or Cut:'+ data)
		controller.copy(data)
	}
}

var logTarget = document.getElementById('logTarget');


function performCopyEmail() {
	var emailLink = document.querySelector('.js-emaillink');

	var range = document.createRange();
	range.selectNode(emailLink);
	window.getSelection().addRange(range);

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		log('Copy email command was ' + msg);
	} catch (err) {
		log('execCommand Error', err);
	}
	window.getSelection().removeAllRanges();
}



document.addEventListener('copy', controller.handleCopy)
document.addEventListener('cut', controller.handleCut)


remoteClipboard.onCopy(controller.handleRemoteCopy)
remoteClipboard.onCut(controller.handleRemoteCopy)

module.exports = controller
