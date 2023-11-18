const mongoose = require('mongoose');
const url= 'mongodb://0.0.0.0/Notebook';

async function connectToMongo() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call the function to connect to MongoDB
module.exports = connectToMongo;