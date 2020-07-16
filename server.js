'use strict';

// libraries
// express - server library
// dotenv - library that lets us access our secrets
// cors - lets anyone talk to our server
//  cors is middleware
// superagent - 
// pg - facilitates communication with db

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const superagent = require('superagent');
require('dotenv').config();

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
// the below will tell you if there is any issue in the connection to the database 
client.on('error', err => {
  console.log('ERROR', err);
});

const PORT = process.env.PORT || 3001;

// ====================================== ROUTES ==============================

// back end event listener on the routes
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
// app.get('/show', showQueryInTable)

// ====================================== FUNCTIONS ============================

// function showQueryInTable(request, response){
//   console.log('made it to the function');
//   let sql = 'SELECT * FROM locations;';
//   client.query(sql)
//     .then(resultsFromPostgres => {
//       let things = resultsFromPostgres.rows;
//       response.send(things);
//     }).catch(err => console.log(err));
// }


function handleLocation(request, response){

  let city = request.query.city;

  let sql = 'SELECT * FROM locations WHERE search_query = $1;';
  let safeValue = [city];

  client.query(sql, safeValue)
    .then (queryResults =>{
    // console.log(queryResults);
    // dont need > 0 because its either falsey or truthy
      if(queryResults.rowCount){
        console.log('more than 0! sending object from db');
        let dbLocationObj = queryResults.rows[0];
        response.status(200).send(dbLocationObj);
      } else{
        console.log('city not here yet, would go to API now')

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
            const localObj = new Location(city, geoData);

            let sqlInsert = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';

            let safeValues = [city, localObj.formatted_query, localObj.latitude, localObj.longitude];

            client.query(sqlInsert, safeValues);

            response.status(200).send(localObj);
          }).catch((error) => {
            console.log('ERROR', error);
            response.status(500).send('Something went wrong with your location request, we are working on this!');
          })
      }
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

// connect to db
// turn it on, see if PORT is listening
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  }).catch(err => console.log('ERROR', err));

