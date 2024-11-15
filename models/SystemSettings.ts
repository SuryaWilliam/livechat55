import mongoose, { Schema, Document, Model } from "mongoose";

interface ISystemSettings extends Document {
  key: string; // Unique identifier for the setting
  value: string | number | boolean; // Setting value
  description?: string; // Optional description of the setting
  updatedAt: Date; // Last update timestamp
}

const SystemSettingsSchema: Schema = new Schema<ISystemSettings>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true }, // Supports string, number, or boolean
  description: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
});

SystemSettingsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const SystemSettings: Model<ISystemSettings> =
  mongoose.models.SystemSettings ||
  mongoose.model<ISystemSettings>("SystemSettings", SystemSettingsSchema);

export default SystemSettings;
