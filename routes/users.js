const express = require ("express");
const router = express.Router();
const User = require ("../models/User.js")
const nodemailer = require ("nodemailer")
const jwt = require("jsonwebtoken")
const notAllowedDomains = ["gmail.com","yahoo.com"];

// simulated email service setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your.email@gmail.com', // Replace with your Gmail address
      pass: 'your-password',       // Replace with your Gmail password
    },
  });

//User registration

router.post("/register",async (req,res) => {
    try {
        const { username, password, email } = req.body;

        //extract domain from the email
        const domain = email.split("@")[1];

        if(notAllowedDomains.includes(domain)) {
            //domain not allowed
            return res.status(400).json({error: "Email domain is not acceptable"})
        }

        //query the database for existing domains
        const existingDomains = await User.distinct("email",{ email: { $regex: new RegExp(domain,"i")}})

        if (existingDomains.length > 0) {
            // Domain recognized, autofill company name
            const company = await User.findOne({ email: existingDomains[0] }).then(user => user.company);
            // Simulate OTP email sending
            const otpCode = generateOTP();
            sendOTP(email, otpCode);
      
            const user = new User({ username, password, email, company });
      
            user.otpCode = otpCode;
            await user.save();
            res.json({ message: 'OTP sent to your email for verification' });
          } else {
            // Domain not recognized, prompt for company name
            return res.json({ promptCompany: true });
          }
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      });



// User Login
router.post("login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});

    if(!user || !user.comparePassword(password)) {
        return res.status(401).json({ error : "Invalid Username or Password!"});
    }
    const jwtSecret = "snapZ"
    const token = jwt.sign({ userId: user._id, jwtSecret})
    res.json({ token })
})

module.exports = router;