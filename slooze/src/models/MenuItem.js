import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  image: {
    type: String,
    required: true, 
  }
});

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
