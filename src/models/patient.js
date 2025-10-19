// models/patient.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const medicine = new mongoose.Schema({
  name:{type:String},
  color:{type:String},
  acceptedtime:{type:String},
  remarks:{type:String}
})

const medicalHistorySchema = new mongoose.Schema({
  dept: { type: String, required: true },
  doctor_name: { type: String },
  followup: { type: Date },
  alert_type: { type: String, default: "Low" },
  problem: { type: String },
  prescription: [medicine]
});

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    sex: {
      type: String,
      required: [true, 'Please provide sex'],
      enum: ['M', 'F', 'N'],
      maxlength: [1, 'Must be M, F, or N'],
    },
    age: {
      type: Number,
      required: [true, 'Please provide age'],
      min: [0, 'Age must be positive'],
    },
    ph_number: {
      type: Number,
      required: [true, 'Please provide phone number'],
      unique: true,
      min: [1000000000, 'Phone number must be 10 digits'],
      max: [9999999999, 'Phone number must be 10 digits'],
    },
    address:{
      type:String
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, 
    },
    med_history: [medicalHistorySchema]
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
patientSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// FIXED: Changed 'User' to 'Patient' in the export
export default mongoose.models.Patient || mongoose.model('Patient', patientSchema);