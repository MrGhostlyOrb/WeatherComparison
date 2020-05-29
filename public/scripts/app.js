let loc1 = new Array();
let loc2 = new Array();
let poll = false;
let myChartData;
let myChartData2;
let myChartData3;


if(localStorage.getItem('loc1')){
	console.log("loc1 already exists");
	loc1 = JSON.parse(localStorage.getItem('loc1'));
	console.log("Data stored : ");
	console.log(loc1);
}
else{
	console.log("loc1 does not exist");
	localStorage.setItem('loc1', JSON.stringify(loc1));
	console.log("Data stored : ");
	console.log(loc1);
}
if(localStorage.getItem('loc2')){
	console.log("loc2 already exists");
	loc2 = JSON.parse(localStorage.getItem('loc2'));
	console.log("Data stored : ");
	console.log(loc2);
}
else{
	console.log("loc2 does not exist");
	localStorage.setItem('loc2', JSON.stringify(loc2));
	console.log("Data stored : ");
	console.log(loc2);
}

function showWeather(){
	//On load add event listener
	document.getElementById('pollingButtonOld')
		.addEventListener("click", () => {poll = true;recieveData();updateButton("old")});
	
	document.getElementById('pollingButtonNew')
		.addEventListener("click", () => {clearCache();poll = true;recieveData();updateButton("new")});
	
	if(document.getElementById('weatherCard2').innerHTML == ""){
		document.getElementById('weatherCard2').innerHTML = "No Data Gathered Yet"
	}
	if(document.getElementById('weatherCard1').innerHTML == ""){
		document.getElementById('weatherCard1').innerHTML = "No Data Gathered Yet"
	}
		
}
function updateButton(button){
	if(button === "old"){
		document.getElementById('pollingButtonOld').style.backgroundColor = "#464E51";
		document.getElementById('pollingButtonOld').innerHTML = "Polling : Active";
	}
	if(button === "new"){
		document.getElementById('pollingButtonNew').style.backgroundColor = "#464E51";
		document.getElementById('pollingButtonNew').innerHTML = "Polling : Active";
	}
}
function clearCache(){
	alert("All data will now be removed");
	loc1 = new Array();
	loc2 = new Array();
	localStorage.setItem('loc1', JSON.stringify(loc1));
	localStorage.setItem('loc2', JSON.stringify(loc2));

}


function recieveData(){
	if(poll == true){
	console.log("Polling for data");
	const socket = io.connect('http://localhost:6060');
  	socket.on('weather', (data) => {
  		console.log("Data recieved from server : ");
    	console.log(data);
    	
    	
    	let recentTempHeswall = data.Heswall.main.temp
    	let recentTempColumbia = data.Columbia.main.temp
    	
    	
    	let date = new Date();
    	let hours = date.getHours();
    	let minutes = date.getMinutes();
    	if(minutes < 10){minutes = "0" + minutes}
    	let time = hours + ":" + minutes
    	console.log("Current time is : " + time)
    	
		console.log("Pushing new data to temp storage");
    	loc1.push({"temp":recentTempHeswall, "time":time});
    	loc2.push({"temp":recentTempColumbia, "time":time});
    	
    	console.log("Saving data to local storage")
    	localStorage.setItem('loc1', JSON.stringify(loc1));
    	localStorage.setItem('loc2', JSON.stringify(loc2));
    	
    	console.log("Data now in storage : " + JSON.parse(localStorage.getItem('loc1')).length + " Data points")
    	console.log(JSON.parse(localStorage.getItem('loc1')));
    	console.log(JSON.parse(localStorage.getItem('loc2')));
    	
    	document.getElementById('weatherCard1').innerHTML = "";
    	document.getElementById('weatherCard2').innerHTML = "";


    	for(let i = 0; i < JSON.parse(localStorage.getItem('loc1')).length;i++){
    		console.log("Writing data to card : ");
    		document.getElementById('weatherCard2').innerHTML = document.getElementById('weatherCard2').innerHTML + "<br><p>"+ JSON.parse(localStorage.getItem('loc1'))[i].temp + "°C - " + JSON.parse(localStorage.getItem('loc1'))[i].time + "</p>";
    	}
    	
    	for(let j = 0; j < JSON.parse(localStorage.getItem('loc2')).length;j++){
    		console.log("Writing data to card : ");
    		if(j == JSON.parse(localStorage.getItem('loc2').length)){console.log("here");}
    		document.getElementById('weatherCard1').innerHTML = document.getElementById('weatherCard1').innerHTML + "<br><p>"+ JSON.parse(localStorage.getItem('loc2'))[j].temp + "°C - " + JSON.parse(localStorage.getItem('loc2'))[j].time +"</p>";
    	}
    	
    	console.log("Sending reciept of weather data request");
    	socket.emit('recieved', { recieved: 'Recieved' });
    	
    	drawGraphs();
    	
  	});
}else{
	console.log("Stopped Polling");
}}

function checkLocalStorage(){
	if(localStorage.getItem('weather1')){
		localStorage.setItem('weather1', []);
	}
	else if(localStorage.getItem('weather2')){
		localStorage.setItem('weather2', []);
	}
	else{
		localStorage.setItem('weather1', []);
		localStorage.setItem('weather2', []);
	}
}

function drawGraphs(){
	console.log("Checking charts");
	
	try{
		myChartData.destroy();
		myChartData2.destroy();
		myChartData3.destroy();
	}
	catch(error){
		console.log(error);
	}
	
	var data = [];
	var time = [];
	var raw = JSON.parse(localStorage.getItem('loc1'))
	for(var i = 0; i < raw.length;i++){
		data.push(raw[i].temp);
		time.push(raw[i].time);
	}
	var ctx = document.getElementById('myChart').getContext('2d');
	myChartData = new Chart(ctx, {
    type: 'line',
    data: {
        labels: time,
        datasets: [{
            label: 'Temprature',
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});
var data2 = [];
var time2 = [];
	var raw2 = JSON.parse(localStorage.getItem('loc2'))
	for(var j = 0; j < raw2.length;j++){
		data2.push(raw2[j].temp);
		time2.push(raw2[j].time);
	}
	var ctx2 = document.getElementById('myChart2').getContext('2d');
	myChartData2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: time2,
        datasets: [{
            label: 'Temprature',
            data: data2,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});

var data3 = [];
var data4 = [];
var time3 = [];
	var raw3 = JSON.parse(localStorage.getItem('loc1'));
	var raw4 = JSON.parse(localStorage.getItem('loc2'));
	for(var k = 0; k < raw3.length;k++){
		data3.push(raw3[k].temp);
		data4.push(raw4[k].temp);
		time3.push(raw3[k].time);
	}
	var ctx3 = document.getElementById('myChart3').getContext('2d');
	myChartData3 = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: time3,
        datasets: [{
            label: 'Heswall',
            data: data3,
            backgroundColor: [
                'rgba(55, 299, 132, 0.2)'
            ],
            borderColor: [
                'rgba(55, 99, 232, 1)'
            ],
            borderWidth: 1
        },{
        label: 'Columbia',
            data: data4,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(155, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
});

}
