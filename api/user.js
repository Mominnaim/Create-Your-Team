const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

//Mongoose model
const User = require('./../models/User')

//Password Handler
const bcrypt = require('bcryptjs')

router.post('/signup', (req,res) => {
    let {username, email, password} = req.body;


    //* result.length will basically return either 0 or 1 so 0 for false and 1 for true,
    //* If it is true then it will return an error.
    User.find({email}).then(result => {
        console.log("Attempting to CREATE AN ACCOUNT")
        if (result.length) {
            console.log("Email already exist")
            //The User already exist
            res.json({
                status:"FAILED",
                message: "User with this email has already been created"
            })
        } else {
            // Try to create new user


            //password handling
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds).then(HashedPassword => {
                const newUser = new User({
                    username,email,password:HashedPassword
                });
                newUser.save().then(result => {
                    console.log("NEW USER HAS BEEN CREATED")
                    res.json({
                        status: "SUCCESS",
                        message: "Sign up has been successful",
                        data: result,
                    })
                }).catch(e => {
                    console.error(e, "An error Occured while saving the password.")
                })
            })
            .catch(e => {
                res.json({
                    status: 'FAILED',
                    message: "There was a problem with the password"
                })
            })
        }
    }).catch (e => {
        console.log("NEW USER COULD NOT BE CREATED")
        res.json({
            status: "FAILED",
            message: "An error has occured with the sign in attempT"
        })
    })
    
})

router.post('/signin', (req,res) => {
    console.log("Attempting to SIGN IN")
    let {username, password} = req.body;

    if (username === "" || password === "") {
        res.json({
            status: "FAILED",
            message: "Invalid Username/Password"
        })
    } else { 
        User.find({username})
        .then(data => {
            if (data.length) {
                //User Exist
                const hashedPassword = data[0].password
                bcrypt.compare(password,hashedPassword).then(result => {
                    if (result) {
                        console.log("SIGNED IN")
                        //password matches
                        res.json({
                            status:"Success",
                            message:'Sign in successful',
                            data: data
                        })
                    } else {
                        console.log("Password failed")
                        res.json({
                            status: "FAILED",
                            message: "Invalid password"
                        })
                    }
                }).catch(e => {
                    console.log(e, "Error has occured matching passwords")
                })
            } else {
                console.log("Username failed")
                res.json({
                    status: "FAILED",
                    message: "Invalid Username"
                })
            }
        }).catch(e => console.log("Error has occured witht the username"))
    }
})

module.exports = router;