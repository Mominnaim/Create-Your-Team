const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: 
    {
        type: String,
        required: [true, "Please enter a username"],
        trim: true,
        maxLength: [20, "Can not have more than 20 characters"]
    },
    email:
    {
        type:String,
        trim: true,
        required: [true, "Please provide email"],
    },
    password:
    {
        type:String,
        trim: true,
        required: [true, "Please provide email"],
        minLength: [5, "You need at least 5 characters for your password"]
    },
    verified: Boolean
});

//* So the first argument is what the collection name will be but in plural and lowercase, the second is the Schema name, and the third is optional 
//* If a third optional is given the data will be sent to that collection rather then the first argument.
const User = mongoose.model('User',UserSchema, "UserPass")

module.exports = User;


// There are some things I want to touch up on like 

// EMAIL ===> I need to have to check if the email has a @ sign and if it doesnt, throw and error

//PASSWORD ---> I want to make sure the password includes and uppercase, lowercase and a number