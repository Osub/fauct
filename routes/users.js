var express = require('express');
var router = express.Router();

/* GET users listing. */
var URL= require('url');
var exec = require('child_process').exec;
var pw='PW5KHs2bSQGMwE5gQvBm6PdX7BvUnY6vaUsBCM44y1XvAgNTuX28F';
/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('Hello World');
});
*/
//检查钱包是否锁定
function checkwallet(res,callback){
	//cleos wallet keys
	var cmdstr='cleos wallet keys';
	exec(cmdstr,function(err,stdout,stderr){
		callback(err,stdout,res);
	})
}
//解锁钱包
function unlockwallet(res,callback){
	//cleos wallet unlock --password PW5KHs2bSQGMwE5gQvBm6PdX7BvUnY6vaUsBCM44y1XvAgNTuX28F
	console.log("正在解锁钱包......");
	var cmdstr='cleos wallet unlock --password '+pw;
	exec(cmdstr,function(err,stdout,stderr){
		callback(err,stdout,res);
	})
}
//认领代币
function claimtoken(res,toname,callback){
	//cleos -u "http://api-kylin.eosasia.one" push action wafytoken123 transfer
	// '["wafydevtoken","moon11112222","1000000.0000 MZ","dev token"]' -p wafydevtoken@active	
	var cmdstr='cleos -u "https://api-kylin.eosasia.one" push action wafytoken123 transfer \'["wafydevtoken",'+toname+',"100.0000 MZ","dev token"]\' -p wafydevtoken@active';
	exec(cmdstr,function(err,stdout,stderr){
		callback(err,stdout,res);
	})
}

//此接口被限制在每天只能调用10次。
router.get('/', function(req, res, next) {

 	var params = URL.parse(req.url, true).query;
 	if('name' in params && params.name !== '') {
 		checkwallet(res,function(err,out,res){
 			if(err){
 				unlockwallet(res,function(err,out,res){
 					if(err) throw err;
 					claimtoken(res,params.name,function(err,stdout,res){
 						if(err){console.log(err);res.send('领取失败');}
 							else{console.log(stdout);res.send('领取100 MZ成功');}
 					})
 				})
 			}else{
 				claimtoken(res,params.name,function(err,stdout,res){
 						if(err){console.log(err);res.send('领取失败');}
 							else{console.log(stdout);res.send('领取100 MZ成功');}
 				})
 			}			
 		})
	}else{    
		res.send('格式错误,示例：/getmztoken?name=eosio');
	}

});
module.exports = router;
