import mongoose from 'mongoose';

const approvalHistorySchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'HolidayRequest', required: true },
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['approved', 'rejected', 'cancelled'], required: true },
    note: { type: String, trim: true }
  },
  { timestamps: true }
);

export const ApprovalHistory = mongoose.model('ApprovalHistory', approvalHistorySchema);
