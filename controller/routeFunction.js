const User = require('../models/User')
const bcrypt = require('bcryptjs')

const signup = async (req, res) => {
    console.log("Attempting to sign in");
    let { username, email, password } = req.body;

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
                        });
                        newUser
                            .save()
                            .then((result) => {
                                console.log("NEW USER HAS BEEN CREATED");
                                return res.json({
                                    status: "SUCCESS",
                                    message: "Sign up has been successful",
                                    data: result,
                                });
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
};


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

module.exports = {signup,signin}