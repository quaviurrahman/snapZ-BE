const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const topicsRouter = require('./routes/topics.js');
const postsRouter = require('./routes/posts.js');
const dashboardRouter = require('./routes/dashboard.js')

const app = express();
const port = process.env.PORT || 3000;



// Connect to MongoDB
mongoose.connect('mongodb+srv://revivefive:$h0kt0123!@cluster0.pevg4q9.mongodb.net/snapZ').then(() => { console.log("Database Connected!")})

app.use(bodyParser.json());

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

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5000'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/topics', topicsRouter);
app.use('/posts', postsRouter);
app.use("/dashboard", dashboardRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});