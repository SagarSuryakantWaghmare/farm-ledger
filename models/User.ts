import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    pin: {
        type: String,
        required: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    language: {
        type: String,
        enum: ['en', 'mr'],
        default: 'en',
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function () {
    if (this.isModified('pin')) {
        this.pin = await bcrypt.hash(this.pin, 10);
    }
    this.updatedAt = new Date();
});

UserSchema.methods.comparePin = async function (candidatePin: string) {
    return await bcrypt.compare(candidatePin, this.pin);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
