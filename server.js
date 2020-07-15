'use strict';

// libraries
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
// express - server library
// dotenv - library that lets us access our secrets
// cors - lets anyone talk to our server



// allowing us to use the libraries
const app = express();
app.use(cors());


// gets the PORT variable from our .env file
const PORT = process.env.PORT || 3001;


// back end event listener on the location route
app.get('/location', handleLocation)

function handleLocation(request, response){

  // request Object, query property
  let city = request.query.city;

  let url = `https://us1.locationiq.com/v1/search.php`;

  let queryParams = {
    key: process.env.GEOCODE_API_KEY,
    q: city,
    format: 'json',
    limit: 1
  }

  superagent.get(url)
    .query(queryParams)
    .then(resultsFromSuperagent => {
      // console.log('these are my results from superagent:', resultsFromSuperagent.body)
      let geoData = resultsFromSuperagent.body;
      const obj = new Location(city, geoData);
      response.status(200).send(obj);
    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('something went wrong, we are working on this');
    })
}


// back end listener for the weather route
app.get('/weather', (request, response) => {

  let weather = require('./data/weather.json');

  let weatherArray = weather.data.map(weatherTime =>{
    return new Weather(weatherTime);
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
  this.time = new Date(object.datetime).toDateString();
  //if something is broken, datetime might not work, may need to access valid_date instead
  this.forecast = object.weather.description;
}



// turn it on, see if PORT is listening
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})