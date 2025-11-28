import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Personal Info subdocument
const personalInfoSchema = new mongoose.Schema(
  {
    givenName: { type: String },
    middleName: { type: String },
    surname: { type: String },
    qualifier: { type: String },
    sex: { type: String, enum: ["Male", "Female"] },
    civilStatus: { type: String },
    birthdate: { type: Date },
    isPWD: { type: Boolean, default: false },
    isFirstTimeJobSeeker: { type: Boolean, default: false },
    nationality: { type: String },
    birthPlace: { type: String },
    otherCountry: { type: String },
  },
  { _id: false }
);

// Address subdocument
const addressSchema = new mongoose.Schema(
  {
    houseNo: { type: String },
    street: { type: String },
    city: { type: String },
    barangay: { type: String },
    province: { type: String },
    postalCode: { type: String },
    country: { type: String },
    email: { type: String },
    mobile: { type: String },
    telephone: { type: String },
  },
  { _id: false }
);

// Family Info subdocument
const familySchema = new mongoose.Schema(
  {
    father: {
      given: String,
      middle: String,
      surname: String,
      qualifier: String,
      birthPlace: String,
      otherCountry: String,
    },
    mother: {
      given: String,
      middle: String,
      surname: String,
      qualifier: String,
      birthPlace: String,
      otherCountry: String,
    },
    spouse: {
      given: String,
      middle: String,
      surname: String,
      qualifier: String,
    },
  },
  { _id: false }
);

// User schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    profileImage: { type: String, default: "" },
    personal_info: { type: personalInfoSchema, required: false }, // optional
    address: { type: addressSchema },
    family: { type: familySchema },
    other_info: {
      height: String,
      weight: String,
      complexion: String,
      identifyingMarks: String,
      bloodType: String,
      religion: String,
      education: String,
      occupation: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    appointments: [
      {
        purpose: String,
        policeStation: String,
        appointmentDate: Date,
        timeSlot: String,
        status: {
          type: String,
          enum: ["pending", "confirmed", "cancelled", "completed"],
          default: "pending",
        },
        paymentStatus: {
          type: String,
          enum: ["unpaid", "paid"],
          default: "unpaid",
        },
        amount: {
          type: Number,
          default: 250,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
