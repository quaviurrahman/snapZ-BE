const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const topicsRouter = require('./routes/topics.js');
const postsRouter = require('./routes/posts.js');
const dashboardRouter = require('./routes/dashboard.js')
const authenticationRouter = require('./routes/users.js')
const cors = require ("cors");

const app = express();
const port = process.env.PORT || 3000;



// Connect to MongoDB
mongoose.connect('mongodb+srv://revivefive:$h0kt0123!@cluster0.pevg4q9.mongodb.net/snapZ').then(() => { console.log("Database Connected!")})

app.use(bodyParser.json());

// Middleware to check the JWT for the routes that require authentication
const checkAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied, please log in.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Forum API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Routes
app.use (cors({origin : "https://snap-z-fe.vercel.app"}));
app.use('/topics', topicsRouter);
app.use('/posts', postsRouter);
app.use("/dashboard", dashboardRouter);
app.use("/auth", authenticationRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});