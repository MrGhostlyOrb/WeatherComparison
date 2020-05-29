//Code will be executed in strict mode
'use strict';

//Imports for node modules
const weather = require('openweather-apis');
const compression = require('compression');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const bodyParser = require('body-parser');
const fs = require('fs');
const app = require('express')();

app.use(compression());

app.engine('pug', require('pug').__express)
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const server = require('http').createServer(app);

const io = require('socket.io')(server);

weather.setLang('en');
weather.setAPPID("e8f23ea88e58105c666142cf5ee81e96");

let currentDataHeswall;

function getWeatherDataHeswall(){

	console.log("Getting current weather for : Heswall");
	weather.setCoordinate(53.318457, -3.078702);
	let weatherData;
	weather.getAllWeather(function(err, JSONObj){
        weatherData = JSONObj;
    });
    setTimeout(function(){
    	currentDataHeswall = weatherData;
    	console.log("Updated weather data");
    }, 2000);
   
}

let currentDataColumbia;

function getWeatherDataColumbia(){

	console.log("Getting current weather for : Columbia");
	weather.setCoordinate(34.146395, -80.894135);
	let weatherData;
	weather.getAllWeather(function(err, JSONObj){
        weatherData = JSONObj;
    });
    setTimeout(function(){
    	currentDataColumbia = weatherData;
    	console.log("Updated weather data");
    }, 2000);
   
}

io.on('connection', (socket) => {
	console.log("Connected : " + Date.now());
	setInterval(function(){
		getWeatherDataHeswall();
		console.log("Got weather data for Heswall");
		getWeatherDataColumbia();
		console.log("Got weather Data for Columbia");
		setTimeout(function(){
			console.log(currentDataHeswall);
			console.log(currentDataColumbia);
			if(currentDataHeswall === undefined ){
				currentDataHeswall = "None";
			}
			if(currentDataColumbia === undefined ){
				currentDataColumbia = "None";
			}
			console.log(currentDataHeswall);
			console.log(currentDataColumbia);
			console.log(Date.now())
			socket.emit('weather', {'Heswall':currentDataHeswall, 'Columbia':currentDataColumbia});
		},3000)
	}, 5 * 60 * 1000);
  
  socket.on('recieved', (data) => {
    console.log(data);
  });
});

server.listen(process.env.PORT || 6060, '0.0.0.0', function(){
  		console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


//Redirect HTTP to HTTPS,
app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));
//Handle requests for static files
app.use(require('express').static('public'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.get('/', function(req,res){
	res.render('weather', {title: "Comparison", message:'This is the weather home page'});
});

app.get('/weather',function(req,res){  
	res.render('weather', {title: "Comparison", message:'This is the weather home page'});
});

	//Options for ssl  
var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}
console.log("Getting first connection data");
getWeatherDataHeswall();
getWeatherDataColumbia();

