// This is the model data for User
const User = require('../models/User')

// This is the model data for userVerification
const UserVerification = require('../models/UserVerification')

// This is the email handler
const nodemailer = require('nodemailer')

// Unique string
const {v4: uuidv4} = require("uuid");

// Password handler
const bcrypt = require('bcryptjs');
const UserVerificationSchema = require('../models/UserVerification');

//path for static verified page
//const path = require("path")


// env variables
require("dotenv").config();

//nodemailer stuff 
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Ready for messages")
        console.log(success)
    }
});


const signup = async (req, res) => {
    console.log("Attempting to sign in");
    let { username, email, password, confirmPassword } = req.body;

    if (password === confirmPassword){
        // Find user by email
        User.find({ email })
            .then((result) => {
                console.log("Attempting to CREATE AN ACCOUNT");
                if (result.length) {
                    console.log("Email already exists");
                    // The User already exists
                    return res.json({
                        status: "FAILED",
                        message: "User with this email has already been created",
                    });
                } else {
                    // Try to create a new user

                    // Password handling
                    const saltRounds = 10;
                    bcrypt
                        .hash(password, saltRounds)
                        .then((HashedPassword) => {
                            const newUser = new User({
                                username,
                                email,
                                password: HashedPassword,
                                verified: false
                            });
                            newUser
                                .save()
                                .then((result) => {
                                    sendVerificationEmail(result, res)
                                })
                                .catch((e) => {
                                    console.error(e, "An error occurred while saving the password.");
                                    return res.json({
                                        status: "FAILED",
                                        message: "An error occurred while saving the user",
                                    });
                                });
                        })
                        .catch((e) => {
                            return res.json({
                                status: "FAILED",
                                message: "There was a problem with the password",
                            });
                        });
                }
            })
            .catch((e) => {
                console.log("NEW USER COULD NOT BE CREATED");
                return res.json({
                    status: "FAILED",
                    message: "An error has occurred with the sign-in attempt",
                });
            });
    }else {
        console.log('Password do not match')
        }
};

// send verification email

const sendVerificationEmail = ({_id, email}, res) => {
    // url to be used in the email
    const currentURL = "http://localhost:5000/";
    
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p> Verify your email <a hred = ${currentURL + "user/verify/" + _id + "/" + uniqueString}> </a></p>`
    };

    //has the unique string
    const saltRounds = 10;
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            const newVerification = new UserVerification({
                userID: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000
            })
            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            res.json({
                                status:"pending",
                                message: "Verification Email sent"
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })
}

// verify email

const SpecifyVerify = async (req, res) => {
    let {userID, uniqueString} = req.params;

    UserVerification.find({userID})
        .then((result) => {
            if(result.length > 0) {
                //user verification record exists so we proceed
                const {expiresAt} = result[0];
                if (expiresAt < Date.now()) {
                    // record has expired so we delete
                    UserVerification
                        .deleteOne({userId})
                        .then()
                        .catch(error => {
                            let message = "An error occured while clearing expired user verification record";
                            res.direct(`/user/verified/error=true&message=${message}`)
                        })
                }
            }else {
                let message = "Account record doesn't exist or has been verified already. Please sign up or log in."
                res.direct(`/user/verified/error=true&message=${message}`)
            }
        })
        .catch((e) => {
            console.log(e)
            let message = "An error occurred while checking for existing user verification record"
            res.direct(`/user/verified/error=true&message=${message}`)
        })
}
/*
// Route to the verified page
const VerifyVerify = async (req,res) => {
    res.sendfile(path.join(__dirname, "./../views/verified.html"));
}
*/



const signin = async (req, res) => {
    console.log("Attempting to SIGN IN");
    let { username, password } = req.body;

    if (username === "" || password === "") {
        // If username or password is empty
        return res.json({
            status: "FAILED",
            message: "Invalid Username/Password",
        });
    } else {
        // Find the user by username
        User.find({ username })
            .then((data) => {
                if (data.length) {
                    // User exists
                    const hashedPassword = data[0].password;
                    bcrypt
                        .compare(password, hashedPassword)
                        .then((result) => {
                            if (result) {
                                console.log("SIGNED IN");
                                // Password matches
                                return res.json({
                                    status: "SUCCESS",
                                    message: "Sign in successful",
                                    data: data,
                                });
                            } else {
                                console.log("Password failed");
                                // Password does not match
                                return res.json({
                                    status: "FAILED",
                                    message: "Invalid password",
                                });
                            }
                        })
                        .catch((e) => {
                            console.log(e, "Error occurred matching passwords");
                            return res.json({
                                status: "FAILED",
                                message: "An error occurred while checking the password",
                            });
                        });
                } else {
                    console.log("Username failed");
                    // User does not exist
                    return res.json({
                        status: "FAILED",
                        message: "Invalid Username",
                    });
                }
            })
            .catch((e) => {
                console.log(e, "Error occurred with the username check");
                return res.json({
                    status: "FAILED",
                    message: "An error occurred while searching for the user",
                });
            });
    }
};

module.exports = {signup,signin,SpecifyVerify}

// VerifyVerify