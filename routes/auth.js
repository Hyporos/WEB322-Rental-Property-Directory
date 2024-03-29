const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Incorrect email or password');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword) {
       return res.status(400).send('Incorrect email or password');
   } 

   const token = jwt.sign({_id: user._id }, config.get('PrivateKey'));

   res.send(token);
});

function validate(req)
 {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(55555).required()
    });
    return schema.validate(req);
 }
 
module.exports = router;