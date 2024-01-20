import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  // define other fields here
}

interface IUserDocument extends IUser, Document {
  _id: Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: String,
  email: String,
  // define other fields here
});

const User: Model<IUserDocument> = mongoose.model("User", userSchema);

export default User;
