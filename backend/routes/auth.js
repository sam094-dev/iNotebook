const express = require('express')
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fetchuser = require("../middleware/fetchuser")
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'Harryisagoodboy'; //Signature for web token 


//Route 1 Create a User Using : Post "/api/auth/createUser". Doesn't Reqire auth


router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
    let success = false;
    // If there are errors , Return bad request ans the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // check whether the user with this email already exist
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Create a New User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass      //secPass,
        })
        // .then(user => res.json(user)).catch(err => console.log(err));
        const data = {
            user: {
                id: user.id
            }
        }
        var authtoken = jwt.sign(data, JWT_SECRET);



        // res.json(user);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//Route 2- Authenticate a User Using : Post "/api/auth/login". No Login Reqire 


router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

], async (req, res) => {
    let success = false;
    // If there are errors , Return bad request ans the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Please Login with Correct Credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {

            return res.status(400).json({ success, error: "Please Login with Correct Credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");

    }
}

)


// Route-3:  Get Login In User Deatils: Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");

    }
})


module.exports = router;