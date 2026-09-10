require('dotenv').config();

var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
const cors = require('cors')


var app = express();


// Login and Register 
require('./auth/auth');
const login = require('./routes/login')
const loggedInPage = require('./routes/loggedInUser');
// ----------------------------------------------------

const bookingRoute = require('./routes/routeSelection')
const bookingsHistoryRoute = require('./routes/bookings')

var registerRouter = require('./routes/register');
//--------------------------------------------------------


//DB Config
const DB_URL = require('./config/keys').MongoURI;

//connect to mongo
//---------------------------------------------
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log("Connected to MongoDB");
        const Bus = require('./models/Buses');
        const demoBuses = [
            // Bangalore → Hyderabad
            ['Bangalore', 'Hyderabad', 'UT-101', 'AC Sleeper', '1000'],
            ['Bangalore', 'Hyderabad', 'UT-102', 'AC Seater', '900'],
            ['Bangalore', 'Hyderabad', 'UT-103', 'Non-AC Sleeper', '750'],
            ['Bangalore', 'Hyderabad', 'UT-104', 'AC Sleeper', '1100'],
            ['Bangalore', 'Hyderabad', 'UT-105', 'AC Seater', '950'],
            ['Bangalore', 'Hyderabad', 'UT-106', 'Volvo AC Sleeper', '1250'],

            // Bangalore → Chennai
            ['Bangalore', 'Chennai', 'UT-201', 'AC Sleeper', '950'],
            ['Bangalore', 'Chennai', 'UT-202', 'AC Seater', '850'],
            ['Bangalore', 'Chennai', 'UT-203', 'Non-AC Seater', '650'],
            ['Bangalore', 'Chennai', 'UT-204', 'AC Sleeper', '1050'],
            ['Bangalore', 'Chennai', 'UT-205', 'Volvo AC Seater', '1150'],
            ['Bangalore', 'Chennai', 'UT-206', 'AC Seater', '900'],

            // Bangalore → Coimbatore
            ['Bangalore', 'Coimbatore', 'UT-301', 'AC Seater', '850'],
            ['Bangalore', 'Coimbatore', 'UT-302', 'AC Sleeper', '1000'],
            ['Bangalore', 'Coimbatore', 'UT-303', 'Non-AC Seater', '600'],
            ['Bangalore', 'Coimbatore', 'UT-304', 'AC Seater', '900'],
            ['Bangalore', 'Coimbatore', 'UT-305', 'Volvo AC Seater', '1050'],
            ['Bangalore', 'Coimbatore', 'UT-306', 'AC Sleeper', '1100'],

            // Chennai → Hyderabad
            ['Chennai', 'Hyderabad', 'UT-401', 'AC Sleeper', '1100'],
            ['Chennai', 'Hyderabad', 'UT-402', 'AC Seater', '950'],
            ['Chennai', 'Hyderabad', 'UT-403', 'Non-AC Sleeper', '800'],
            ['Chennai', 'Hyderabad', 'UT-404', 'AC Seater', '1000'],
            ['Chennai', 'Hyderabad', 'UT-405', 'Volvo AC Sleeper', '1250'],
            ['Chennai', 'Hyderabad', 'UT-406', 'AC Sleeper', '1150'],

            // Hyderabad → Bangalore
            ['Hyderabad', 'Bangalore', 'UT-501', 'AC Sleeper', '1000'],
            ['Hyderabad', 'Bangalore', 'UT-502', 'AC Seater', '900'],
            ['Hyderabad', 'Bangalore', 'UT-503', 'Non-AC Seater', '700'],
            ['Hyderabad', 'Bangalore', 'UT-504', 'AC Sleeper', '1100'],
            ['Hyderabad', 'Bangalore', 'UT-505', 'Volvo AC Sleeper', '1200'],
            ['Hyderabad', 'Bangalore', 'UT-506', 'AC Seater', '950'],

            // Mysore → Bangalore
            ['Mysore', 'Bangalore', 'UT-601', 'AC Seater', '500'],
            ['Mysore', 'Bangalore', 'UT-602', 'Non-AC Seater', '350'],
            ['Mysore', 'Bangalore', 'UT-603', 'AC Sleeper', '650'],
            ['Mysore', 'Bangalore', 'UT-604', 'AC Seater', '550'],
            ['Mysore', 'Bangalore', 'UT-605', 'Volvo AC Seater', '700'],
            ['Mysore', 'Bangalore', 'UT-606', 'AC Sleeper', '750']
        ];

        for (const [startCity, destination, busNumber, busType, pricePerSeat] of demoBuses) {
            await Bus.updateOne(
                { busNumber },
                { $setOnInsert: {
                    companyName: 'Unique Travels',
                    busType,
                    busNumber,
                    startCity,
                    destination,
                    totalSeats: '30',
                    availableSeats: '30',
                    pricePerSeat
                } },
                { upsert: true }
            );
        }
        console.log('Demo buses ready (36 buses)');
    })
    .catch(err => {
        throw err
    })
//---------------------------------------------


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use('/', login);
app.use('/booking', bookingRoute);
app.use('/bookings', passport.authenticate('jwt', { session: false }), bookingsHistoryRoute);
app.use('/register', registerRouter);  // To register page 
app.use('/user', passport.authenticate('jwt', { session: false }), loggedInPage); //To Secure Route

module.exports = app;
