var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var express = require('express');
var app = express();
var cors = require('cors');
var Web3 = require('web3');
var web3 = new Web3();
var path = require('path');	
var http = require('http');

web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8085"));

var abi = [{"constant":false,"inputs":[{"name":"_aucId","type":"uint256"}],"name":"changeStatusOfAuction","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"itemId","type":"uint256"}],"name":"searchItem","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getItems","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"iName","type":"string"},{"name":"iDesc","type":"string"},{"name":"own","type":"address"}],"name":"registerItem","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_aucId","type":"uint256"},{"name":"itemId","type":"uint256"},{"name":"_userId","type":"uint256"},{"name":"bidprice","type":"uint256"}],"name":"makebid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"itemid","type":"uint256"},{"name":"startTime","type":"uint256"},{"name":"endTime","type":"uint256"},{"name":"bPrice","type":"uint256"},{"name":"fPrice","type":"uint256"}],"name":"createAuction","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"uID","type":"uint256"},{"name":"pass","type":"bytes32"}],"name":"login","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"aname","type":"string"},{"name":"pass","type":"bytes32"},{"name":"bal","type":"uint256"},{"name":"uaddress","type":"address"}],"name":"registerUser","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

var contadd = "0xac45cbb83d4f42ad38459d0bbb44444a58f5eb9b";

var con = web3.eth.contract(abi).at(contadd);

app.use(cors());  
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));


//Register
app.post('/register',function(req,res){
	// console.log(web3.eth.accounts[0]);
	// console.log(req.body.username, ": ",req.body.password);
	
	var usr = req.body.username;
	var pass = web3.fromAscii(req.body.password);	
  	var addr =web3.personal.newAccount("qwerty");
	var bal = req.body.balance;
	var t = con.registerUser.call(usr,pass,bal,addr,{from:web3.eth.accounts[0],gas:0x493E0});
	var p = con.registerUser(usr,pass,bal,addr,{from:web3.eth.accounts[0],gas:0x493E0});
	web3.eth.sendTransaction({from:web3.eth.coinbase, to:addr, value: web3.toWei(20, "ether")})
	var test ;
	web3.eth.filter("latest").watch(function () {
		if (web3.eth.getTransaction(p).blockNumber!==null) {
			test = t;	
		}
	});
	
	if(t >= 10000){
		res.send("Registeration Successful " + " Note Your USER-ID: " + t);
	}else{
		res.send("Registeration Unsuccessful");
	}
});


//Login
app.post('/login',function(req,res){
	var usrid = parseInt(req.body.userid);
	var pass = req.body.password;
	var p=con.login.call(usrid,pass);
    console.log(p == true);
    if(p == true){
    	res.send("Login Successful. " + "Please Note Your Address: "+web3.eth.accounts[0]);
    } 
});


function Item(id , name, desc, owner){
	this.ID = id;
	this.Name = name;
	this.Desc = desc;
	this.Owner = owner;
}

//to get the items.
app.post('/itemslist', function(req,res){
	var itemList = [];
	let itemsCount = con.getItems.call();
	for(let i = 10000; i<= itemsCount ; i++){
		let p = con.searchItem.call(i);
		itemList.push(p);
	}
	res.send(itemList);
});

//register Item
app.post('/registerItem', function(req, res){
	let itemname = req.body.itemName;
	let itemdesc = req.body.itemDesc;
	let ownAdd = req.body.owner; // address of the owner of the item.
	let t = con.registerItem.call(itemname, itemdesc, ownAdd);
	let p = con.registerItem(itemname, itemdesc, ownAdd,{from:web3.eth.accounts[0],gas:0x493E0});
	var test;
	web3.eth.filter("latest").watch(function () {
		if (web3.eth.getTransaction(p).blockNumber!==null) {
			test = t;
		}
	});
	if(t >= 10000){
		res.send("Item Registered "+ "item id: " + parseInt(t));
	}else{
		res.send("Not registered");
	}
});



// create auction
app.post('/createauction', function(req, res){
	let itemid = parseInt(req.body.itemId);
	let starttime = parseInt(req.body.starttime);
	let endtime = parseInt(req.body.endtime);
	let baseprice = parseInt(req.body.baseprice);
	let finalprice = parseInt(req.body.finalprice);
	console.log("itemid: ", itemid,"starttime: ", starttime,"endtime: ",endtime, "baseprice: ",baseprice,"finalprice: ",finalprice );
	let t = con.createAuction.call(itemid, starttime,endtime,baseprice, finalprice);
	let p = con.createAuction(itemid,starttime,endtime, baseprice, finalprice,{from:web3.eth.accounts[0],gas:0x493E0});
	var test;
	console.log("t:", parseInt(t) );
	web3.eth.filter("latest").watch(function () {
		if (web3.eth.getTransaction(p).blockNumber!==null) {
			test = t;
		}
	});

	if(parseInt(t) >= 10000){
		res.send('Auction Created. Auction Id: '+ parseInt(t));
	}else{
		res.send("Auctions Not Created ");
	}

});



app.post('/makebid', function(req, res){
	let aucid = parseInt(req.body.aucId);
	let itemid = parseInt(req.body.itemId);
	let userid = parseInt(req.body.userId);
	let bidprice = parseInt(req.body.bidPrice);
	
	console.log("aucid: ",aucid, "itemid: ",itemid, "userid: ", userid, "bidprice", bidprice );
	let t = con.makebid.call(aucid, itemid,userid, bidprice);
	let p = con.makebid(aucid, itemid, userid, bidprice,{from:web3.eth.accounts[0],gas:0x493E0});
	
	web3.eth.filter("latest").watch(function () {
		if (web3.eth.getTransaction(p).blockNumber!==null) {
		}
	});	
	if(t == true){
		res.send(JSON.stringify("Bid Placed"));
	}else{
		res.send(JSON.stringify("Bid Not able to Placed"));
	}
});


var server = app.listen(5000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);	

});