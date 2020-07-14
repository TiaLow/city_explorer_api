'use strict';

const express = require('express');

const app = express();

require('dotenv').config();

const cors = require('cors');

app.use(cors());

const PORT = process.env.PORT;



app.get('/location', (request, response) => {
  // console.log('this is the request object:', request)

  let city = request.query.city;

  let geoData = require('./data/location.json');

  // response.send('this is working');

  const obj = new Location(city, geoData);

  response.send(obj);
});

app.get('/weather', (request, response) => {


  let weather = require('./data/weather.json');

  let weatherArray = [];
  weather.data.forEach(weatherTime => {
    weatherArray.push(new Weather(weatherTime));
  })

  response.send(weatherArray);

})

function Location(location, obj){
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
  this.search_query = location;
  this.formatted_query = obj[0].display_name;
}

function Weather(object){
  this.time = object.datetime;
  this.forecast = object.weather.description;
}



app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
