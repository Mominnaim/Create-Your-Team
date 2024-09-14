const express = require('express') // This is express again
const router = express.Router(); // This is the routing method
                                // This router object is used to define a set of routes that can be mounted in the mian application.

const {signin,signup, SpecifyVerify /*,VerifyVerify*/ } = require("../controller/routeFunction")


router.route('/signin').post(signin)
router.route('/signup').post(signup)
router.route("/verify/:userId/:uniqueString").get(SpecifyVerify)
// router.get("/verified").get(VerifyVerify)

module.exports = router



