var express = require("express")
var bodyParser = require("body-parser")
var logger = require("morgan")
var mongoose = require("mongoose")

mongoose.Promise = Promise

var port = process.env.PORT || 3000;

var app = express()

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static("public"))

// Database configuration for mongoose
// db: newsscrape

var local_db = "mongodb://localhost/newsscrape"

//check if HEROKU then use environment variable to connect to db else use local db
if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI, function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log("Mongoose connection successful.");
        }
    });
}
else{
    mongoose.connect(local_db, function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log("Mongoose connection successful.");
        }
    });
}
// Hook mongoose connection to db
var db = mongoose.connection;

// Log any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

require("./routes/routing")(app, db);


// Listen on port 3000
app.listen(port, function() {
    console.log(`Listening on PORT ${port}`);
});
