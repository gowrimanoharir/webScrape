var express = require("express")
var bodyParser = require("body-parser")
var logger = require("morgan")
var mongoose = require("mongoose")

mongoose.Promise = Promise

var app = express()

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(express.static("public"))

// Database configuration for mongoose
// db: newsscrape
mongoose.connect("mongodb://localhost/newsscrape", function(err){
    if(err){
        console.log(err)
    }
    else{
        console.log("Mongoose connection successful.");
    }
});
// Hook mongoose connection to db
var db = mongoose.connection;

// Log any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

require("./routes/routing")(app, db);


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
