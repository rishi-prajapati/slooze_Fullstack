import mongoose from 'mongoose';

// Inline OrderItem schema to avoid missing-module errors
const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  country: { type: String, enum: ['INDIA', 'AMERICA'], required: true },
  status: { type: String, enum: ['CART', 'PENDING', 'PAID', 'CANCELLED'], default: 'CART' },
  items: { type: [orderItemSchema], required: true },

  // Optional address fields
  street: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  zip: { type: String, default: null },
  countryName: { type: String, default: null },

  createdAt: { type: Date, default: Date.now },
});

const order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default order;
