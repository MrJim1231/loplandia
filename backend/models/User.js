import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  confirmationCode: {
    type: String,
  },
  confirmationCodeExpires: {
    type: Date,
  },
  emailVerified: {
    type: Boolean,
    default: false, // Статус подтверждения email
  },
})

export default mongoose.model('User', userSchema)
