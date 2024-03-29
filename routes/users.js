const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if (error) {
        console.log(req.body.email);
        console.log(req.body.password);
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exists!');
    } else {
        user = new User({
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = jwt.sign({_id: user._id }, config.get('PrivateKey'));
        res.send(token);
    }
});

module.exports = router;