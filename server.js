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
app.get('/movies', handleMovies);
app.get('/yelp', handleYelp);

// ====================================== FUNCTIONS ============================


function handleLocation(request, response){

  let city = request.query.city;

  let sql = 'SELECT * FROM locations WHERE search_query = $1;';
  let safeValue = [city];

  client.query(sql, safeValue)
    .then (queryResults =>{


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

function handleMovies(request, response){

  let url = 'https://api.themoviedb.org/3/search/movie/';

  let movieQueryParams = {
    api_key: process.env.MOVIE_API_KEY,
    query: request.query.search_query
  }

  superagent.get(url)
    .query(movieQueryParams)
    .then(movieResults => {

      let movieArray = movieResults.body.results.map(resultObj =>{
        return new Movies(resultObj);
      })

      response.status(200).send(movieArray);

    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went wrong with your movie request, we are working on this!');
    })
}

function handleYelp(request, response){

  let url = 'https://api.yelp.com/v3/businesses/search';

  let restaurantsQueryParams = {
    // Authorization: 'Bearer ' + process.env.MOVIE_API_KEY,
    latitude: request.query.latitude,
    longitude: request.query.longitude
  }
//https://stackoverflow.com/questions/53507153/authentication-bearer-in-react
  superagent.get(url)
    .set({'Authorization': 'Bearer ' + process.env.YELP_API_KEY})
    .query(restaurantsQueryParams)
    .then (resultsFromSuper => {
      console.log('sup! results');

      let restaurantArray = resultsFromSuper.body.businesses.map(restaurant => {
        return new Restaurant(restaurant);
      })

      response.status(200).send(restaurantArray);
    }).catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Something went wrong with your restaurant request, we are working on this!');
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

function Movies(movieObject){
  this.title = movieObject.original_title;
  this.overview = movieObject.overview;
  this.average_votes = movieObject.vote_average;
  this.total_votes = movieObject.vote_count;
  this.image_url = 'https://image.tmdb.org/t/p/w500' + movieObject.poster_path;
  //need w500 to get img (if you dont use it img doesnt show), but keeping w500 throws error in network tools
  this.popularity = movieObject.popularity;
  this.released_on = movieObject.release_date;
}

function Restaurant(restaurantObj){
  this.name = restaurantObj.name;
  this.image_url = restaurantObj.image_url;
  this.price = restaurantObj.price;
  this.rating = restaurantObj.rating;
  this.url = restaurantObj.url;
}


// ================================================================================

// connect to db
// turn it on, see if PORT is listening
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  }).catch(err => console.log('ERROR', err));



  //404 error handler

