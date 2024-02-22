import mongoose, { Document, Model, Schema } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
  comparePassword: (password: string) => Promise<boolean>;
  generateJwtToken: () => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [6, "Email must be at least 6 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is required."],
      trim: true,
      minlength: [2, "First Name must be at least 2 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required."],
      trim: true,
      minlength: [2, "Last Name must be at least 2 characters."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
    },
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
  // check if email exists
  const emailExists = await User.findOne({ email: this.email });
  if (emailExists) {
    return next({
      message: "Email already exists",
      name: "Email",
    });
  }

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

userSchema.methods.generateJwtToken =
  async function generateToken(): Promise<string> {
    const token = jwt.sign(
      {
        id: this._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
    return token;
  };

const User: Model<IUserDocument> = mongoose.model("User", userSchema);

export default User;
