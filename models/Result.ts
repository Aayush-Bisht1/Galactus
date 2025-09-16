import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    data: [{
        train_id: String,
        eligible: {
            type: Boolean, 
            default: false
        },
        priority_score: Number,
        reasons: [String],
        recommendations: [String]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);