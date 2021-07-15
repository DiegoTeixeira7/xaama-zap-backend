//  Loading database modules
import { model, Schema, Model, Document, Types } from 'mongoose';

interface IRoom extends Document {
  type: string;
  name: string;
  description: string;
  numberParticipants: number;
  usersId: [Types.ObjectId];
  userCreatorId: Types.ObjectId;
  usersIdAdmin: [Types.ObjectId];
  messageId: [Types.ObjectId];
  creationAt: Date;
  updateAt: Date;
}

//	Defining Room schema
const RoomSchema: Schema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  numberParticipants: {
    type: Number,
    default: 1
  },
  usersId: {
    type: [Types.ObjectId],
    ref: 'Users'
  },
  userCreatorId: {
    type: Types.ObjectId,
    ref: 'Users'
  },
  usersIdAdmin: {
    type: [Types.ObjectId],
    ref: 'Users'
  },
  messageId: {
    type: [Types.ObjectId],
    ref: 'Messages',
    default: []
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

//	Creating collection Rooms on database
const rooms: Model<IRoom> = model('Rooms', RoomSchema)

export { rooms };