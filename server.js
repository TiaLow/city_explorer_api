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




function Location(location, obj){
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
  this.search_query = location;
  this.formatted_query = obj[0].display_name;
}



app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
