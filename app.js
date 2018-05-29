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
var list = []
var allUser = []
//var router = require('express').Router()
io.on('connection',function(socket){
	//console.log(socket)
	socket.on('join',function(data){
		var user = {}
		user.name = data;
		user.id = socket.id;
		allUser.push(user);
		io.emit('serverJoin',data+'加入了聊天室')
		io.emit('showList',allUser)
	})
	socket.on('messageSend',function(data){
		//io.emit('serverSend',data.time+':'+data.value ) //发给所有人
		socket.broadcast.emit('serverSend',data)  //发送给除了自己以外的所有人
	})
	socket.on('someMessage',function(data){
		//console.log('群内发送')
		for(var i=0;i<list.length;i++){
			io.sockets.to(list[i]).emit('serverSend',data)
		}
		
	})
	socket.on('add',function(data){
		list.push(socket.id)
		io.emit('serverJoin',data+'加入了群聊')
		console.log(list)
	})

	socket.on('leave',function(data){
		var index = list.indexOf(socket.id)
		list.splice(index, 1)
		io.emit('serverJoin',data+'离开了群聊')
	})

	/*socket.on('close',function(data){
		io.emit('serverJoin',data+'离开了聊天室')
		socket.disconnect(true,111)		
	})*/

	socket.on('disconnect',function(){ //当浏览器刷新的时候会触发  socket.disconnect(true)也会触发
		var index;
		for (var i=0;i<allUser.length;i++){
			if(socket.id == allUser[i].id){
				index = i;
				break;
			}
		}
		var name = allUser[i].name
		allUser.splice(index,1)
		io.emit('showList',allUser)
		io.emit('serverJoin',name+'离开了聊天室')
		//socket.disconnect(true)	
	})

})
app.get('/', function(req, res){
  res.sendFile(__dirname + '/static/talk.html');
});
http.listen(3000, function(){
  console.log('listening on 3000');
});