import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    password: {
        type: String,
        default: 'untitled'
    },
    lastName: {
        type: String,
        minLength: 3
    },
    location: {
        type: String,
        default: 'my city'
    }
})

UserSchema.pre('save', async function() {
    const hashedPassword = await bcrypt.hash(this.password, 12)
    return hashedPassword
})

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

UserSchema.methods.createJWT = function() {
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

export default mongoose.model('User', UserSchema)