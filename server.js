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

// ====================================== ROUTES ==============================

// back end event listener on the routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);


// ====================================== FUNCTIONS ============================

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
      let geoData = resultsFromSuperagent.body;
      const obj = new Location(city, geoData);
      response.status(200).send(obj);
    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went wrong with your location request, we are working on this!');
    })
}

function handleWeather(request, response){

  let url = 'https://api.weatherbit.io/v2.0/forecast/daily';
  let cityLatitude = request.query.latitude;
  let cityLongitude= request.query.longitude;

  let weatherQueryParams = {
    key: process.env.WEATHER_API_KEY,
    lat: cityLatitude,
    lon: cityLongitude,
    days: 8,
    units: 'I',
    format: 'json',
  }

  superagent.get(url)
    .query(weatherQueryParams)
    .then(results => {

      let weatherArray = results.body.data.map(resultObject =>{
        return new Weather(resultObject);
      })

      response.status(200).send(weatherArray);

    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went wrong with your weather request, we are working on this!');
    })
}


function handleTrails(request, response){

  let url = 'https://www.hikingproject.com/data/get-trails';

  let trailQueryParams = {
    key: process.env.TRAIL_API_KEY,
    lat: request.query.latitude,
    lon: request.query.longitude,
    maxResults: 10,
  }

  superagent.get(url)
    .query(trailQueryParams)
    .then(results => {

      let trailArray = results.body.trails.map(resultObj =>{
        return new Trails(resultObj);
      })

      response.status(200).send(trailArray);

    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went wrong with your trail request, we are working on this!');
    })
}


// ====================================== CONSTRUCTORS ============================

function Location(location, obj){
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
  this.search_query = location;
  this.formatted_query = obj[0].display_name;
}

function Weather(object){
  this.time = new Date(object.valid_date).toDateString();
  this.forecast = object.weather.description;
}

function Trails(trailObject){
  this.name = trailObject.name;
  this.location = trailObject.location;
  this.length = trailObject.length;
  this.stars = trailObject.stars;
  this.star_votes = trailObject.starVotes;
  this.summary = trailObject.summary;
  this.trail_url = trailObject.url;
  this.conditions = trailObject.conditionStatus + ' & ' + trailObject.conditionDetails;
  this.condition_date = new Date(trailObject.conditionDate).toDateString();
  this.condition_time = new Date(trailObject.conditionDate).toLocaleTimeString();
}



// ================================================================================


// turn it on, see if PORT is listening
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
