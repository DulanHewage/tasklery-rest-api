import mongoose, { Document, Model, Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  verified?: boolean;
  verificationToken?: string;
}

interface IUserDocument extends IUser, Document {
  _id: Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 6,
    },
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    password: { type: String, required: true, trim: true, minlength: 8 },
    verified: { type: Boolean, default: false },
    verificationToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(20).toString("hex"),
    },
    // define other fields here
  },
  { timestamps: true }
);

// helper methods
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// pre-save hook
userSchema.pre<IUserDocument>("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await hashPassword(this.password);
      return next();
    } catch (error) {
      return next(error as Error);
    }
  }
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUserDocument> = mongoose.model("User", userSchema);

export default User;
