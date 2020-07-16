### city_explorer_api
Labs 6-9

# Project: City Explorer API

**Author**: Tia Low
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->

This application will utilize a front-end where the user can come to the webpage and search for a city that they would like information on. The user would like to be able to search for any city and get the relevant city information. This app utilizes database storage and will send the results from the database if they already exist, or pull information from an API if not. 

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

- User should install libraries on your machine (npm install -S...)
  - express
  - dotenv
  - cors
  - superagent

  - (npm i will install dependencies for short term)

- User should create a .env file, see envSamples

- User will need to request API keys from LocationIQ, Weatherbit, Hiking Project


## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
- Dependencies:
  - express
  - dotenv
  - cors
  - superagent
  
## Change Log

07-13-2020 3:35pm - Dependencies are established, files scaffolded 

07-13-2020 3:50pm - Application is deployed to Heroku for first test

07-13-2020 5:25pm - Created route for /location, confirmed its pulling lat and lon data  

07-13-2020 5:45pm - Confirmed Heroku-deployed app is functioning correctly by sending data to the webpage

07-13-2020 6:20pm - Created route for /weather, confirmed it's pulling array of dates and forecasts

07-13-2020 6:30pm - Confirmed Heroku-deployed app is functioning correctly by sending the weather array data to webpage

07-13-2020 10:20pm - Confirmed error message syntax multiple times, not seeing epxlicit 500 errror, not quite sure how to test further. TBC! 

07-14-2020 3:45pm - Refactored weather route to use .map(), utilized Date object to reformat date to include day

07-14-2020 5:15pm - Replaced fake data with call to location API, deployed to Heroku and confirmed everything is working using API key. Map renders. Neat!

07-14-2020 6:55pm - Used call to weather API to replace fake weather data, deployed to Heroku and confirmed everything is working. 

07-14-2020 7:35pm - Accessed trails API, deploying to Heroku to confirm functionality

07-15-2020 3:35pm - Created schema.sql, tested table with dummy info. Accessed table in terminal, it worked booyah! 

07-16-2020 7:35am - Completed if/else statement for pull from database vs request to API. Confirmed functionality using local host. Deploying to Heroku now. 

07-16-2020 7:50am - Running push again to remove .env files from github

## Credits and Collaborations

- Worked on Lab 6 with Blake Romero
- Chance Harmon contributed with help as TA
- Worked a bit on Lab 7 with Jen & Meghan
- Lab 8 with Beasley, Blake, Meghan, Amber, Jen
- Lab 9 with Paul


## Feature Tasks - Time Estimates

1. Lab 6 - Repository Setup

Estimate of time needed to complete: 30 mins

Start time: 2:15pm

Finish time: 3:45pm

Actual time needed to complete: 1.5hr


2. Lab 6 - Locations

Estimate of time needed to complete: 1 hr

Start time: 4:00pm

Finish time: 5:30pm

Actual time needed to complete: 1.5 hr


3. Lab 6 - Weather

Estimate of time needed to complete: 1 hr

Start time: 5:55pm

Finish time: 6:30pm

Actual time needed to complete: 35 min


4. Lab 6 - Errors

Estimate of time needed to complete: 45 mins

Start time: 6:35pm, 10pm

Finish time: 6:50pm, 10:20pm

Actual time needed to complete: 35 mins
<hr>

1. Lab 7 - Data Formatting

Estimate of time needed to complete: 30 mins

Start time: 3:30pm

Finish time: 3:45pm

Actual time needed to complete: 15 mins to refactor using .map, about 15 before then to format date (to use day too)


2. Lab 7 - Locations

Estimate of time needed to complete: 1.5 hr

Start time: 3:50pm

Finish time: 5:15pm

Actual time needed to complete: 1.5(ish) hrs


3. Lab 7 - Weather

Estimate of time needed to complete: 45 mins

Start time: 5:35pm

Finish time: 6:55pm

Actual time needed to complete: 1.5(ish) hrs


4. Lab 7 - Trails

Estimate of time needed to complete: 45 mins

Start time: 7:00pm

Finish time: 7:30pm

Actual time needed to complete: 30 mins
<hr>

1. Lab 8 - Database

Estimate of time needed to complete: 1 hr

Start time: 2:45pm

Finish time: 3:35pm

Actual time needed to complete: 50 mins


2. Lab 8 - Server

Estimate of time needed to complete: 1.5 hr

Start time: 3:40pm

Finish time: ..... (7:35am July 16)

Actual time needed to complete: I worked on this feature off and on for a total of 4.5 hours or so. 


3. Lab 8 - Deploy

Estimate of time needed to complete: 20 mins

Start time: 7:45am 

Finish time: _____

Actual time needed to complete: _____
<hr>



1. Lab 9 - Movies

Estimate of time needed to complete: 75 min (Tia- over)

Start time: 3:30pm

Finish time: _____

Actual time needed to complete: _____


2. Lab 9 - Yelp

Estimate of time needed to complete: 60 min (Paul - 50)

Start time: _____

Finish time: _____

Actual time needed to complete: _____


2. Lab 9 - Pagination

Estimate of time needed to complete: 60 min (Tia- under)

Start time: _____

Finish time: _____

Actual time needed to complete: _____