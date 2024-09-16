const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
    userID: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
});

//* So the first argument is what the collection name will be but in plural and lowercase, the second is the Schema name, and the third is optional 
//* If a third optional is given the data will be sent to that collection rather then the first argument.
const UserVerification = mongoose.model('UserVerification', UserVerificationSchema)

module.exports = UserVerification;


// There are some things I want to touch up on like 

// EMAIL ===> I need to have to check if the email has a @ sign and if it doesnt, throw and error

//PASSWORD ---> I want to make sure the password includes and uppercase, lowercase and a numbe