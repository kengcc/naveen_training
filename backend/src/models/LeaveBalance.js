import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    year: { type: Number, required: true },
    entitlementDays: { type: Number, required: true },
    usedDays: { type: Number, default: 0 },
    pendingDays: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);
