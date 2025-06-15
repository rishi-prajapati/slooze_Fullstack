import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 3,
    maxlength: 100
  },
  country: { 
    type: String, 
    enum: ['INDIA', 'AMERICA'], 
    required: true 
  },
  image: {
    type: String,
    required: true, 
  }
}, {
  timestamps: true
});

const Restaurant = mongoose.models.Restaurant || 
                   mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
