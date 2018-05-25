/*var express = require('express')

var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,  
    wss = new WebSocketServer({port: 8000});  
//var uuid = require('node-uuid');
var router = express.Router()
wss.on('connection', function(ws) {
	console.log('链接')
	ws.send(JSON.stringify({  
        "type": 'asdjl',  
        "id": '1234',  
      }))
	ws.on('message', function(message) {
		console.log(message)
	})
})*/
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = require('express').Router()
io.on('connection',function(socket){
	socket.on('messageSend',function(data){
		console.log(22222)
	})
	socket.emit('serverSend',555)
})
router.get('/',function(req, res, next){
	//console.log(uuid)
	res.sendfile('./static/talk.html')
})
module.exports = router;