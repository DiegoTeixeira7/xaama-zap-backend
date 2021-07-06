//  Loading database modules
import { model, Schema, Model, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  phone: string;
  password: string;
  isOnline: boolean;
  creationAt: Date;
  updateAt: Date;
}

//	Defining User schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  creationAt: {
    type: Date,
    default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
})

//	Creating collection Users on database
const users: Model<IUser> = model('Users', UserSchema)

export { users };