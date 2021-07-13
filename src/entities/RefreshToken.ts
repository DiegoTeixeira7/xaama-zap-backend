//  Loading database modules
import { model, Schema, Model, Document, Types } from 'mongoose';

interface IRefreshToken extends Document {
  userId: Types.ObjectId,
  expiresIn: number;
  creationAt: Date;
  updateAt: Date;
}

//	Defining Refresh Token schema
const RefreshTokenSchema: Schema = new Schema({
  expiresIn: {
    type: Number,
    default: 0
  },
  userId: {
    type: Types.ObjectId,
    ref: 'Users'
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

//	Creating collection Refresh Token on database
const refreshTokens: Model<IRefreshToken> = model('RefreshTokens', RefreshTokenSchema)

export { refreshTokens };