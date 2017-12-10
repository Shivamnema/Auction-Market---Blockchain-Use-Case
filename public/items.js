$(document).ready(function(){

    function updateHTML(data){
		var trHTML = '';
		var itemId = 0;
		var itemname = '';
		var desc = '';
		var own = '';
        console.log(data);

		for(let i = 0; i < data.length-1; i++){

			let row = data[i];
			itemId = row[0];
			itemname = row[1];
			desc = row[2];
			own = row[3];
            // console.log(itemId, itemname, desc, own)
            trHTML += '<tr>\
            <td>'+itemId+'</td>\
            <td>'+itemname+'</td>\
            <td>'+desc+'</td>\
            <td>'+own+'</td>\
            </tr>';
			$('#rest').html(trHTML);
		}   

    }


    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:5000/itemslist",
        success: function(data){
            updateHTML(data);
        }
    })
    
});