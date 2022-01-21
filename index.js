//instantiating dependencies

const express = require('express');
const app = express();
const pool = require('./db');
const axios = require('axios');
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());

//routes

//get all incidents
app.get('/api/incidents', async (req, res) =>{
    try {
        const allIncidents = await pool.query("SELECT * FROM incident");
        res.json(allIncidents.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//create an incident
app.post('/api/incidents', async (req, res) => {
    const description = req.body.incidents_desc;
            console.log("desc " + description);
            const city = req.body.city;
            const country = req.body.country;
            const datetime = new Date();
    await axios.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+process.env.API_KEY)
    .then(async (response) =>  {
     var report = response.data.weather[0];
        console.log(JSON.stringify(report));
        try {
        
            const newTodo =  await pool.query("INSERT INTO incident (incident_desc, city, country, date, weather_report) VALUES ($1, $2, $3, $4, $5) RETURNING *", [description, city, country, datetime, JSON.stringify(report)]);
            res.json(newTodo.rows[0]);
        } catch (err) {
          console.error("err "+err.message);
    }
  })
  .catch(error => {
    console.log("error jjjj"+err.message);
  });

    
});


app.listen(5000, () => {
    console.log('listening on port 5000');
})





// axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&appid=e75bf373954e4307ce9381b8590978bc')
//     .then(response => {
//      report = response.data.weather[0];
//     console.log(JSON.stringify(report));
//   })
//   .catch(error => {
//     console.log("error jjjj"+err.message);
//   });

app.listen(4000, () => {
    console.log('listening on port 5000');
})