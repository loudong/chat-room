/*var express = require('express')
var path = require('path')
var talk = require('./router/talk')
var app = new express()
app.use(express.static(path.join(__dirname + '/static')))
app.use('/',talk)
app.listen(3000,function(){
	console.log('server running in 3000')
})
module.exports = app;*/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var router = require('express').Router()
io.on('connection',function(socket){
	socket.on('join',function(data){
		io.emit('serverJoin',data+'加入了聊天室')
	})
	socket.on('messageSend',function(data){
		//io.emit('serverSend',data.time+':'+data.value ) //发给所有人
		socket.broadcast.emit('serverSend',data)  //发送给除了自己以外的所有人
	})
	socket.on('close',function(data){
		io.emit('serverJoin',data+'离开了聊天室')
		socket.disconnect(true)	
	})

})
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/talk.html');
});
http.listen(3000, function(){
  console.log('listening on 3000');
});