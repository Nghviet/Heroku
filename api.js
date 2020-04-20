const express = require("express"); 
const router = express.Router();

const bcrypt = require('bcrypt');

const mysql = require('mysql');

const cookieParser = require('cookie-parser');
var con;
if (process.env.NODE_ENV !== 'production') {
    console.log("Local");
    con = mysql.createConnection({
        host : "127.0.0.1",
        port : "3306",
        user : "root",
        password : "1111",
        database : "INT2207"
    })
}
else {
    con = mysql.createConnection({
    	host : "db4free.net",
        port : "3306",
    	user : "nghviet",
    	password : "F@AnR9XTqCQ2vPj",
    	database : "nghviet"
    });
}

con.connect(err => {
	if(err) {
        throw err;
	}
});

router.get("/",(req,res) => {
	res.send("API is working properly");
});

router.post("/login",function(req,res) {
	var email = req.body.email;
	var password = req.body.password;
	con.query("SELECT * FROM user WHERE email = '"+email+"'" ,(err,result) => {
		if(err) throw err;
		if(result.length != 1) {
			res.send({code : 0});
			return;
		}
		else {
			var ac = bcrypt.compareSync(password,result[0].password)
			if(ac == false) {
				res.send({code : 0});
				return;
			}
			else 
			res.send({code : 1,_id : result[0].id,name : result[0].name});
		}
	});
});

router.post("/signup",async (req,res) => {
	var email = req.body.email;
	var password = req.body.password;
	var name = req.body.name;
	con.query("SELECT * FROM user WHERE email = '" + email +"'", (err,r) => {
		if(err) {
			res.send({code : 0});
			throw err;
		}
		if(r.length === 0) {
			bcrypt.hash(password,10,(err,hash) => {
				if(err) {
					res.send({code : 0});
					throw err;
				}

				con.query("INSERT INTO user (name,email,password) VALUE ('" + name +"', '" + email+"', '" +hash +"')",
					(err,result) => {
						if(err) {
							res.send({code : 0});
							throw err;
						}
						con.query("INSERT INTO friend (userid,friendid) VALUE ('" + result.insertId + "', '" +result.insertId+"')"),
						(err,result) => {
							if(err) {
								res.send({code : 0});
								throw err;
							}
						}
						res.send({code : 1,_id : result.insertId});	
						return;
					});
			});
		}
		else {
			res.send({code : 0});
		}
	})	
});

router.post("/post",async(req,res) => {
	var id = req.body.userID;
	var name = req.body.name;
	var post = req.body.post;
	var time = Date.now();
	con.query("INSERT INTO post (userid,name,post,date) " + 
		"VALUE ('" + id + "', '" + name +"', '" + post + "', FROM_UNIXTIME('" + time *0.001+"'))", 
		(err,result) => {
			if(err) {
				res.send({code : 0});
				throw err;
			}

			res.send({code : 1})
		})
});

router.post("/allPost", async(req,res) => {
	var id = req.body.userID;
	con.query("SELECT friendid FROM friend WHERE userid = '" + id +"'",(err,friendList) => {
		if(err) {
			res.send({code : 0});
			throw err;
		}
		var arr =[];
		for(var i=0;i<friendList.length;i++) arr[i] = friendList[i].friendid;
		con.query("SELECT * FROM post WHERE userid IN (?) ORDER BY date DESC",[arr],(err,result) => {
			res.send(result);
		})
	});
});

router.post("/search" ,(req,res) => {
	var keyword = req.body.keyword;
	var userid = req.body.id;
	con.query("SELECT * FROM user WHERE (name LIKE '%"+ keyword + "%' OR email LIKE '%" + keyword + "%') "
		     +"AND NOT EXISTS ( SELECT * FROM friend WHERE userid = '" + userid + "' AND friendid = user.id )",
		(err,result) => {
			if(err) {
				res.send({code : 0});
				throw err;
			}
			res.send({code : 1, matched : result});
		});
})

router.post("/bind",(req,res) => {
	var id1 = req.body.id1;
	var id2 = req.body.id2;
	con.query("INSERT INTO friend (userid,friendid) VALUE ('" + id1 + "', '" + id2 + "')",(err,result) => {
		if(err) throw err;
	});
	con.query("INSERT INTO friend (userid,friendid) VALUE ('" + id2 + "', '" + id1 + "')",(err,result) => {
		if(err) throw err;
	});
	con.query("DELETE FROM pendingRequest WHERE fromID = '" + id1 +"' AND toID = '" + id2 +"'",(err,result) => {
		if(err) throw err;
	})
	res.send({code : 1});
});

router.post("/unbind",(req,res) => {
	var id1 = req.body.id1;
	var id2 = req.body.id2;
	con.query("DELETE FROM friend WHERE toID = '" + id1 + "' AND fromID = '" + id2 + "'",(err,result) => {
		if(err) throw err;
	});
	con.query("DELETE FROM friend WHERE toID = '" + id1 + "' AND fromID = '" + id2 + "'",(err,result) => {
		if(err) throw err;
	});
	con.query("INSERT INTO pendingRequest(fromID,toID) VALUE ('" + id1+ "', '" + id2 +"')",(err,result) => {
		if(err) throw err;
	});
	res.send({code : 1});
})

router.post("/newRequest",(req,res) => {
	var from = req.body.from;
	var to = req.body.to;
	con.query("INSERT INTO pendingRequest (fromID,toID) VALUE ('" + from +"', '" + to + "')",(err,result) => {
		if(err) throw err;
	});
})

router.post("/eraseRequest",(req,res) => {
	var from = req.body.from;
	var to = req.body.to;

	con.query("DELETE FROM pendingRequest WHERE fromID = '" + from +"' AND toID = '" + to +  "'",
		(err,result) => {
		if(err) throw err;
	});

	res.send({code : 1});
});

router.post("/checkRequest",(req,res) => {
	var from = req.body.from;
	var to = req.body.to;

	con.query("SELECT * FROM pendingRequest WHERE fromID = '" + from +"' AND toID = '" + to + "'",(err,result) => {
		if(err) throw err;
		res.send({code : 1,length : result.length});
	})
});

router.post("/allRequest",(req,res) => {
	var id = req.body.id;
	con.query("SELECT * FROM pendingRequest,user WHERE pendingRequest.toID ='" + id + "' AND user.id = pendingRequest.fromID",(err,result) => { 
		if(err) throw err;
		res.send({code : 1, result : result});
	})
});

module.exports =  (io) => {
    var clients = [];
    io.on('connection', socket => {
        socket.on('shake',data => {     
            for(var i=0;i<clients.length;i++) 
                if(clients[i].uid === data.uid && clients[i].socketId === socket.id) return; 
            var clientInfo = {};
            clientInfo.uid = data.uid;
            clientInfo.socketId = socket.id;
            clients.push(clientInfo);
        })

        socket.on('disconnect', () => {
            for(var i = 0;i < clients.length; i++) 
                if(clients[i].socketId == socket.id) clients.splice(i,1);
        })

        socket.on('chatList', (uid) => {
            con.query("SELECT DISTINCT fromID, toID,name FROM chat,user WHERE user.id = chat.fromID AND (fromID = '" + uid + "' OR toID = '" + uid +"') GROUP BY fromID,toID ORDER BY MAX(date) ASC",(err,rawChat) => {
                if(err) throw err;
                var chatListID = [];
                var chatListFull = [];
                for(var i=0;i<rawChat.length;i++) {
                    if(rawChat[i].fromID === uid) {
                        if(chatListID.indexOf(rawChat[i].toID) === -1) {
                            chatListID.push(rawChat[i].toID);
                            chatListFull.push({ 
                                id : rawChat[i].toID,
                                name : rawChat[i].name
                            });
                        }
                    }
                    else {
                        if(chatListID.indexOf(rawChat[i].fromID) === -1) {
                            chatListID.push(rawChat[i].fromID);
                            chatListFull.push({
                                id : rawChat[i].fromID,
                                name : rawChat[i].name
                            })
                        }
                    }
                }

                con.query("SELECT * FROM friend,user WHERE user.id = friend.friendid AND friend.userid ='" + uid+ "'",(err,friendList) => {
                    if(err) throw err;
                    for(var i=0;i<friendList.length;i++) {
                        if(chatListID.indexOf(friendList[i].id) === -1) {
                            chatListID.push(friendList[i].id)
                            chatListFull.push({
                                id : friendList[i].id,
                                name : friendList[i].name
                            })
                        }
                    }
                    var lastChatID = chatListID[0];
                    con.query("SELECT * FROM chat WHERE (fromID = '" + uid +"' AND toID = '" + lastChatID +"') OR ( fromID = '" + lastChatID + "' AND toID = '" + uid + "') ORDER BY date ASC",(err,conv) => {
                        if(err) throw err;
                        socket.emit('chatListRet',{
                            chatList : chatListFull,
                            curChat : conv,
                            curChatID : lastChatID
                        })
                    })
                })
            })   
        })

        socket.on('message',data => {
            var from = data.fromID;
            var to = data.toID;
            var chat = data.message;
            var time = Date.now();
            var socketFrom = clients.find(obj => obj.uid == from);
            var socketTo = clients.find(obj => obj.uid == to);
            con.query("INSERT INTO chat(fromID,toID,chat,date)" + 
                      "VALUE ('" + from + "', '" + to + "', '" + chat +"', FROM_UNIXTIME('" + time * 0.001 +"'))",
                (err,result) => {
                    if(err) throw err;
                    console.log(result.insertId);
                    for(var i=0;i<clients.length;i++) if(clients[i].uid === from || clients[i].uid === to) {
                        io.to(clients[i].socketId).emit('newMessage',{
                            fromID : from,
                            toID : to,
                            chat : chat,
                            id : result.insertId
                        })
                    }
            });

            for(var i=0;i<clients.length;i++) if(clients[i].uid === to) io.to(clients[i].socketId.emit('newMessage',{fromID : to,chat : chat}))
        })

        socket.on('fetch',data => {
            var uid = data.uid;
            var eid = data.eid;
            con.query("SELECT * FROM chat WHERE (fromID = '" + uid + "' AND toID = '" + eid + "') OR (fromID = '" + eid + "' AND toID = '" + uid +"') ORDER BY date ASC",
                (err,result) => {
                    if(err) throw err;
                    for(var i=0;i<clients.length;i++) if(clients[i].uid == uid)
                        io.to(clients[i].socketId).emit('fetchRep',result);
                })
        

        })
    })
    return router;
};