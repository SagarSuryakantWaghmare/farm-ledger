import mongoose from 'mongoose';

const FarmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    location: {
        type: String,
        trim: true,
    },
    area: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true,
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

FarmSchema.pre('save', async function () {
    this.updatedAt = new Date();
});

export default mongoose.models.Farm || mongoose.model('Farm', FarmSchema);
