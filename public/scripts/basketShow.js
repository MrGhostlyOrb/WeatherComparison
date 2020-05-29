//Execute code in strict method
'use strict';


let listBasket = document.getElementById("listForBasket")
let basketList2;

if (localStorage.getItem('basket')){
	basketList2 = JSON.parse(localStorage.getItem('basket'));
	showBasketList();
}
else{
	listBasket.append("<li>There is nothing in your basket</li>")
}

localStorage.setItem('basket', JSON.stringify(basketList2));
const data2 = JSON.parse(localStorage.getItem('basket'));



function showBasketList(){

	const li = "<li class = 'listItem'>"
	const cli = "</li>"

	for(let i = 0; i < basketList2.length; i++){
	
	const parsedList = JSON.parse(basketList2[i]);
		listBasket.innerHTML = listBasket.innerHTML + li + "Product Number : " + parsedList.Item.ProductNo + "<br>Quantity : " + parsedList.Item.Quantity + cli
	}
	
}

function checkQty(){
	var allGood = true;
	for(let i = 0; i < basketList2.length; i++){
	
	const parsedList = JSON.parse(basketList2[i]);
		if(parsedList.Item.Quantity === "undefined"){
			allGood = false;
			alert("Please add a quantity for : " + parsedList.Item.ProductName + " and re-send your order. Your order has not been sent.")
			
		}
		else{
			console.log("order will be sent")
			
		}
	}
	if(allGood === true){
		sendBasket();
		alert("Thank you, your order has been sent")
	}
	
}

