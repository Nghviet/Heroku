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
	con.query("INSERT INTO post (post_userid,name,post,date) " + 
		"VALUE ('" + id + "', '" + name +"', '" + post + "', FROM_UNIXTIME('" + time *0.001+"'))", 
		(err,result) => {
			if(err) {
				res.send({code : 0});
				throw err;
			}

			res.send({code : 1,result : result})
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
		con.query("SELECT if(exists(select * from react where post.idpost = react.like_postid and react.like_userid = '1'),1,0) reacted ,post.* FROM post WHERE post_userid IN (?) ORDER BY date DESC",[arr],(err,result) => {
			res.send(result);
		})
	});
});

router.post("/getPost",(req,res) => {
    var id = req.body.id;t
    con.query("select * from post where post_userid = '" + id + "'",(err,result) => {
        if(err) throw err;
        res.send({
            post:result,

        });
        console.log(result);
    })
})

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
	con.query("DELETE FROM pendingRequest WHERE pending_from = '" + id1 +"' AND pending_to = '" + id2 +"'",(err,result) => {
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
	con.query("INSERT INTO pendingRequest(pending_from,pending_to) VALUE ('" + id1+ "', '" + id2 +"')",(err,result) => {
		if(err) throw err;
	});
	res.send({code : 1});
})

router.post("/newRequest",(req,res) => {
	var from = req.body.from;
	var to = req.body.to;
	con.query("INSERT INTO pendingRequest (pending_from,pending_to) VALUE ('" + from +"', '" + to + "')",(err,result) => {
		if(err) throw err;
	});
})

router.post("/eraseRequest",(req,res) => {
	var from = req.body.from;
	var to = req.body.to;

	con.query("DELETE FROM pendingRequest WHERE pending_from = '" + from +"' AND pending_to = '" + to +  "'",
		(err,result) => {
		if(err) throw err;
	});

	res.send({code : 1});
});

router.post("/checkRequest",(req,res) => {
	var from = req.body.from;
	var to = req.body.to;

	con.query("SELECT * FROM pendingRequest WHERE pending_from = '" + from +"' AND pending_to = '" + to + "'",(err,result) => {
		if(err) throw err;
		res.send({code : 1,length : result.length});
	})
});

router.post("/allRequest",(req,res) => {
	var id = req.body.id;
	con.query("SELECT * FROM pendingRequest,user WHERE pendingRequest.pending_to ='" + id + "' AND user.id = pendingRequest.pending_from",(err,result) => { 
		if(err) throw err;
		res.send({code : 1, result : result});
	})
});

router.post("/getUser",(req,res) => {
    var id = req.body.id;
    con.query("select * from user where id ='" + id + "'",(err,result) => {
        if(err) throw err;
        if(result.length === 1)
        res.send({
            userName: result[0]
        })
        else res.send({
            userName:null
        })
    })
}) 

router.post("/like",(req,res) => {
    var postid = req.body.postid;
    var uid = req.body.id;
    con.query("insert into react(like_userid,like_postid) value ('" + uid +"', '" + postid + "')",(err,result) => {
        if(err) throw err;
        res.send({done : true});
    })
})

router.post("/unlike",(req,res) => {
    var postid = req.body.postid;
    var uid = req.body.id;
    con.query("delete from react where like_userid ='" + uid + "' and like_postid ='" + postid +"'",(err,result) => {
        if(err) throw err;
        res.send({done : true})
    })
})

router.post("/likeList",(req,res) => {
    
})

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
            con.query("select * from (select if(chat_to = '" + uid + "',chat_from,chat_to) as fid, max(date) as maxdate from chat group by fid order by max(date) desc) as allias inner join user on user.id = allias.fid order by allias.maxdate desc",(err,rawChat) => {
                if(err) throw err;
                var chatListID = [];
                var chatListFull = [];
                for(var i=0;i<rawChat.length;i++) {
                    chatListID.push(rawChat[i].fid);
                    chatListFull.push({
                        id : rawChat[i].fid,
                        name : rawChat[i].name
                    })
                }
                console.log(rawChat);

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
                    con.query("SELECT * FROM chat WHERE (chat_from = '" + uid +"' AND chat_to = '" + lastChatID +"') OR ( chat_from = '" + lastChatID + "' AND chat_to = '" + uid + "') ORDER BY date ASC",(err,conv) => {
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
            console.log(from+" "+to);
            var socketFrom = clients.find(obj => obj.uid == from);
            var socketTo = clients.find(obj => obj.uid == to);
            con.query("INSERT INTO chat(chat_from,chat_to,chat,date)" + 
                      "VALUE ('" + from + "', '" + to + "', '" + chat +"', FROM_UNIXTIME('" + time * 0.001 +"'))",
                (err,result) => {
                    if(err) throw err;
                    console.log(result.insertId);
                    for(var i=0;i<clients.length;i++){
                        if(clients[i].uid == from || clients[i].uid == to) {
                            io.to(clients[i].socketId).emit('newMessage',{
                                fromID : from,
                                toID : to,
                                chat : chat,
                                id : result.insertId
                            });
                        //    if(clients[i].uid == from) console.log("From");else console.log("To");
                        }
                        console.log(clients[i].uid == to);
                    } 
            });
        })

        socket.on('fetch',data => {
            var uid = data.uid;
            var eid = data.eid;
            con.query("SELECT * FROM chat WHERE (chat_from = '" + uid + "' AND chat_to = '" + eid + "') OR (chat_from = '" + eid + "' AND chat_to = '" + uid +"') ORDER BY date ASC",
                (err,result) => {
                    if(err) throw err;
                    for(var i=0;i<clients.length;i++) if(clients[i].uid == uid)
                        io.to(clients[i].socketId).emit('fetchRep',result);
                })
        

        })
    })
    return router;
};