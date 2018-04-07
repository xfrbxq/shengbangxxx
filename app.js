var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var iconv = require('iconv-lite');
var fs=require("fs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","pug");

app.get("/",function(req,res){
	getDate(function(json){
		res.render("index",{data:json});
	})
})
////前台详情页面
app.get("/where/:name",function(req,res){
	var name=req.params.name;
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
			if(json.newslist[i].title == name){
				res.render("where",{data:json.newslist[i]})
			}
		}
	})
})
////后台详情页面
app.get("/houtai_where/:name",function(req,res){
	var name=req.params.name;
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
			if(json.newslist[i].title == name){
				res.render("houtai_where",{data:json.newslist[i]})
			}
		}
	})	
})
app.get("/houtai_where",function(req,res){
	req.render("houtai_where")
})
//修改文章
app.post("/xiugai",function(req,res){
	var biaoti= req.body.biaoti;
	var zong = req.body;
	// var newObj = {
	// 	title:zong.title,
	// 	author:zong.author,
	// 	content:zong.content,
	// 	date:zong.date,
	// 	praise:zong.praise
	// }
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
			if(json.newslist[i].title == biaoti){
				var newObj = {
					title:zong.title,
					author:zong.author,
					content:zong.content,
					date:zong.date,
					praise:zong.praise,
					comments:json.newslist[i].comments
				}
				json.newslist[i]=newObj;
				var newjson=JSON.stringify(json,null,4);
				fs.writeFile("data/zl.json",newjson)
				res.send("修改成功")
			}
		} 
	})
})
//后台删除评论
app.post("/del",function(req,res){
	var biaoti= req.body.biaoti;
	var index=req.body.index
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
			if(json.newslist[i].title == biaoti){
				json.newslist[i].comments.splice(index,1);
				var newjson=JSON.stringify(json,null,4);
				fs.writeFile("data/zl.json",newjson)
				res.send("评论删除成功")
			}
		} 
	})
})
// 前台添加评论
app.post("/insert",function(req,res){
	var biaoti= req.body.biaoti;
	var comment = req.body;
	var newObj = {
		username:comment.username,
		says:comment.says
	}
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
			if(json.newslist[i].title == biaoti){
				json.newslist[i].comments.push(newObj)
				var newjson=JSON.stringify(json,null,4);
				fs.writeFile("data/zl.json",newjson)
				res.send(json.newslist[i].comments)
			}
		} 
	})
})
// 前台点赞
app.post("/praise",function(req,res){
	var biaoti=req.body.biaoti;
	// console.log(biaoti)
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
			if(json.newslist[i].title == biaoti){
				json.newslist[i].praise=req.body.praise;
				var newjson1=JSON.stringify(json,null,4);
				fs.writeFile("data/zl.json",newjson1)
				res.send(json.newslist[i].praise)
			}
		}
	})
})
// 注册
app.get("/zc",function(req,res){
	res.render("zc")
})
app.post("/zhuce",function(req,res){
	getDate(function(json){
		var name=json.username;
		var name_body=req.body.username;
		// console.log(name[1].username)
		for (var i = 0; i < name.length; i++) {
			if(name[i].username===name_body){
				// console.log(name[i].username)
				res.redirect("zc_fail")
				return false;
			}
		}
		json.username.push(req.body)
				var newjson=JSON.stringify(json,null,4)
				fs.writeFile("data/zl.json",newjson)
				res.redirect("denglu")
	})
})
app.get("/zc_fail",function(req,res){
	res.render("zc_fail")
})
// 登录
app.get("/denglu",function(req,res){
		res.render("denglu")
})
app.post("/denglu",function(req,res){
	getDate(function(json){
		var name=json.username;
		var name_body=req.body.username;
		var pwd_body=req.body.pwd;
		// console.log(name[1].username)
		for (var i = 0; i < name.length; i++) {
			if(name[i].username===name_body && name[i].pwd==pwd_body){
				console.log(name[i].username+name_body+pwd_body)
				res.redirect("/")
				return false;
			}
		}
		res.redirect("denglu_fail")
	})
})
app.get("/denglu_fail",function(req,res){
	res.render("denglu_fail")
})
// // // 后台管理
app.get("/houtai",function(req,res){
	getDate(function(json){
		res.render("houtai",{data:json});
	})
})
//////后台添加文章
app.get("/content_insert",function(req,res){
	res.render("content_insert")
})
app.post("/content_insert",function(req,res){
	var zong = req.body;
	getDate(function(json){
		var newObj1={
			title:zong.title,
			author:zong.author,
			content:zong.content,
			date:zong.date,
			praise:zong.praise,
			comments:[]
		}
		json.newslist.push(newObj1);
		var newjson=JSON.stringify(json,null,4);
		fs.writeFile("data/zl.json",newjson)
		res.send("添加成功")
	})
})
//////后台删除文章
app.post("/del_content",function(req,res){
	var biaoti=req.body.biaoti;
	getDate(function(json){
		for (var i = 0; i < json.newslist.length; i++) {
		 if(json.newslist[i].title==biaoti){
		 	json.newslist.splice(i,1)
		 	var newjson=JSON.stringify(json,null,4)
		 	fs.writeFile("data/zl.json",newjson)
		 	res.send("删除成功")
		 }
		}
	})
})
function getDate(callback){
	fs.readFile("data/zl.json","utf8",function(err,data){
		var json=JSON.parse(data);
		callback(json);
	});
}


app.listen("3002",function(){
	console.log("Running 3002")
})