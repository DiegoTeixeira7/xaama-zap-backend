//  Loading database modules
import { model, Schema, Model, Document, Types } from 'mongoose';

interface IMessage extends Document {
  roomId: Types.ObjectId,
  userId: Types.ObjectId,
  message: string,
  creationAt: Date;
  updateAt: Date;
}

//	Defining Message schema
const MessageSchema: Schema = new Schema({
  roomId: {
    type: Types.ObjectId,
    ref: 'Rooms'
  },
  userId: {
    type: Types.ObjectId,
    ref: 'Users'
  },
  message: {
    type: String,
    required: true
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

//	Creating collection Messages on database
const messages: Model<IMessage> = model('Messages', MessageSchema)

export { messages };