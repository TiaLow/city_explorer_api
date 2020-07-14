'use strict';

// libraries
const express = require('express');
const cors = require('cors');
require('dotenv').config();
// express - server library
// dotenv - library that lets us access our secrets
// cors - lets anyone talk to our server



// allowing us to use the libraries
const app = express();
app.use(cors());


// gets the PORT variable from our .env file
const PORT = process.env.PORT;


// back end event listener on the location route
app.get('/location', (request, response) => {

  try{

    // request Object, query property
    let city = request.query.city;

    let geoData = require('./data/location.json');

    const obj = new Location(city, geoData);

    response.status(200).send(obj);
  } catch(error){
    console.log('ERROR', error);
    response.status(500).send('You did not enter a correct location! Please try again.');
  }
});


// back end listener for the weather route
app.get('/weather', (request, response) => {

  let weather = require('./data/weather.json');

  let weatherArray = [];
  weather.data.forEach(weatherTime => {
    weatherArray.push(new Weather(weatherTime));
  })

  response.send(weatherArray);

});


function Location(location, obj){
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
  this.search_query = location;
  this.formatted_query = obj[0].display_name;
}

function Weather(object){
  this.time = object.datetime;
  //if something is broken, datetime might not work, may need to access valid_date instead
  this.forecast = object.weather.description;
}



// console log to see if PORT is listening
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
