const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://qwertyuiop:1234567890@cluster0.orwa0oh.mongodb.net/mernsatck?retryWrites=true&w=majority"
function connectToMongo() {
    mongoose.connect(mongoURI).then(() => {
        console.log("connection Successfull");
    }).catch((err) => console.log(err));
}


module.exports = connectToMongo;
