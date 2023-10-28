const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const topicsRouter = require('./routes/topics.js');
const postsRouter = require('./routes/posts.js');
const dashboardRouter = require('./routes/dashboard.js')
const userRouter = require('./routes/users.js')
const cors = require ('cors');

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

// Global CORS middleware
app.use(cors());

// Routes
app.use('/topics', topicsRouter);
app.use('/posts', postsRouter);
app.use("/dashboard", dashboardRouter);
app.use("/user", userRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});