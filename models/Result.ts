import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    data: [{
        train_id: { 
            type: String, 
            required: true 
        },
        eligible: { 
            type: Boolean, 
            default: false 
        },
        priority_score: { 
            type: Number, 
            default: 0 
        },
        status: { 
            type: String, 
            enum: ["Ready", "Standby", "Maintenance"], 
            default: "Standby" 
        },
        fitness_days_left: { 
            type: Number, 
            default: 0 
        },
        reasons: { 
            type: mongoose.Schema.Types.Mixed, 
            default: [] 
        },
        recommendations: { 
            type: mongoose.Schema.Types.Mixed, 
            default: [] 
        },
        cleaning: {
            last_clean_end: { 
                type: Date, 
                default: null 
            },
            clean_age_hours: { 
                type: Number, 
                default: 0 
            },
            today_clean_load: { 
                type: Number, 
                default: 0 
            }
        },
        maintenance: {
            open_work_orders: { 
                type: Number, 
                default: 0 
            },
            open_work_order_hours: { 
                type: Number, 
                default: 0 
            }
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Ensure timestamps are updated automatically
    timestamps: true,
    // Ensure virtuals are included when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add index for better query performance
resultSchema.index({ userId: 1, createdAt: -1 });

// Pre-save middleware to ensure data integrity
resultSchema.pre('save', function(next) {
    // Ensure each train data has proper structure
    if (this.data && Array.isArray(this.data)) {
        this.data.forEach((train: any) => {
            // Ensure cleaning object exists
            if (!train.cleaning) {
                train.cleaning = {
                    last_clean_end: null,
                    clean_age_hours: 0,
                    today_clean_load: 0
                };
            }
            
            // Ensure maintenance object exists
            if (!train.maintenance) {
                train.maintenance = {
                    open_work_orders: 0,
                    open_work_order_hours: 0
                };
            }
            
            // Ensure reasons is an array
            if (typeof train.reasons === 'string') {
                train.reasons = train.reasons.split(' | ').map((s: string) => s.trim()).filter(Boolean);
            } else if (!Array.isArray(train.reasons)) {
                train.reasons = [];
            }
            
            // Ensure recommendations is an array
            if (typeof train.recommendations === 'string') {
                train.recommendations = train.recommendations.split(' | ').map((s: string) => s.trim()).filter(Boolean);
            } else if (!Array.isArray(train.recommendations)) {
                train.recommendations = [];
            }
        });
    }
    next();
});

export const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);