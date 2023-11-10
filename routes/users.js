const express = require ('express');
const router = express.Router();
const User = require ('../models/User.js')
const jwt = require('jsonwebtoken')
const notAllowedDomains = ["gmail.com","yahoo.com"];

// simulated email service setup
// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: 'your.email@gmail.com', // Replace with your Gmail address
//       pass: 'your-password',       // Replace with your Gmail password
//     },
//   });

// Register a User
router.post('/register',async (req,res) => {
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
        // Simulate OTP email sending
        const otpCode = generateOTP();
        //sendOTP(email, otpCode);
        const user = new User({ 
          username: username, 
          password: password, 
          email: email, 
          otpCode: otpCode 
        });
        if (existingDomains.length > 0) {
            // Domain recognized, autofill company name
            const company = await User.findOne({ email: existingDomains[0] }).then(user => user.company);
          } else {
            // Domain not recognized, prompt for company name
            console.log(otpCode)
            console.log(JSON.stringify(user))
            await user.save();
            return res.json({ promptCompany: true });
          }
          console.log(JSON.stringify(user))
          res.json({ message: 'OTP sent to your email for verification' });
          console.log(otpCode);
          await user.save();


        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      });

// Verify a token
router.post('/verify', async (req, res) => {
        try {
          const { email, otpCode, company } = req.body;
          const user = await User.findOne({ email, otpCode });
      
          if (!user) {
            return res.status(401).json({ error: 'Invalid OTP code' });
          }
          user.company = company;
          user.otpCode = undefined; // Clear OTP code
          await user.save();
          res.json({ message: 'Registration successful' });
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      });

// function sendOTP(email, otpCode) {
//         // Simulate sending OTP email
//         const mailOptions = {
//           from: 'your.email@gmail.com',
//           to: email,
//           subject: 'Verification Code for Registration',
//           text: `Your OTP code is: ${otpCode}`,
//         };
      
      //   transporter.sendMail(mailOptions, (error, info) => {
      //     if (error) {
      //       console.error('Error sending OTP email:', error);
      //     } else {
      //       console.log('OTP email sent: ' + info.response);
      //     }
      //   });
      // }


// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});

    if(!user || !user.comparePassword(password)) {
        return res.status(401).json({ error : "Invalid Username or Password!"});
    }
    const jwtSecret = 'snapZ'
    const token = jwt.sign({ userId: user._id}, jwtSecret)
    res.json({ token })
});

// Function to generate OPT code
function generateOTP() {
  // Simulate OTP generation
  return Math.floor(1000 + Math.random() * 9000).toString();
};

module.exports = router;