// jq function for getbalance 

$(document).ready(function(){	

	$('#btn-login').click(function(event) {
	event.preventDefault(); 
	$.ajax({
			type: 'POST',
			url: "http://127.0.0.1:5000/login",
			headers: {
				"content-type":"application/x-www-form-urlencoded"
			},
			data: {
				"userid": $('#login-userid').val(),
				"password": $('#login-password').val()
			},
			success: function(data){
				console.log("data: ", data);
				alert(JSON.stringify(data));
				window.location.href = "dash.html";
				
			}
		});
	});

	$('#btn-signup').click(function(event) {
	event.preventDefault(); 
		$.ajax({
			type: 'POST',
			url: "http://127.0.0.1:5000/register",
			headers: {
				"content-type":"application/x-www-form-urlencoded"
			},
			data: {
				"username": $('#name').val(),
				"password": $('#password').val(),
				"balance": $('#balance').val()
			},
			success: function(data){ 
				// console.log("reg: ", data);
				alert(JSON.stringify(data));
				window.location.href = "index.html"																																																																									

			}
		});
	
	});




// Ajax for create Auction
	$('#regauc').click(function(event) {
	event.preventDefault();

		$.ajax({
			type: 'POST',
			url: "http://127.0.0.1:5000/createauction",
			headers: {
				"content-type":"application/x-www-form-urlencoded"
			},
			data: {
				"itemId" : $('#itemid').val(),
				"starttime" : $('#starttime').val(),
				"endtime" : $('#endtime').val(),
				"baseprice" : $('#baseprice').val(),
				"finalprice" : $('#finalprice').val()
			},
			success: function(data){
				console.log(data);
				alert(JSON.stringify(data));
				// window.location.href = "dash.html";
			}

		});
	});


// Ajax for makebid
	$('#bidmake').click(function(event) {
	event.preventDefault();

		$.ajax({
			type: 'POST',
			url: "http://127.0.0.1:5000/makebid",
			headers: {
				"content-type":"application/x-www-form-urlencoded"
			},
			data: {
				"aucId" : $('#aucid').val(),
				"itemId" : $('#itemid').val(),
				"userId" : $('#userid').val(),
				"bidPrice" : $('#bidprice').val()
			},
			success: function(data){
				alert(JSON.stringify(data));
				window.location.href = "dash.html";
			}

		});
	});

	$('#itemslist').click(function(event) {
		
		location.replace("items.html");
			
	});	

	

});// end of document.ready


