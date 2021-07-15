//  Loading database modules
import { model, Schema, Model, Document, Types } from 'mongoose';

interface IUserRoom extends Document {
  roomId: Types.ObjectId,
  userId: Types.ObjectId,
  isOff: boolean,
  creationAt: Date;
  updateAt: Date;
}

//	Defining UserRoom schema
const UserRoomSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'Users'
  },
  roomId: {
    type: [Types.ObjectId],
    ref: 'Rooms'
  },
  clearMessagesRoomId: {
    type: [Types.ObjectId],
    ref: 'Rooms'
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

//	Creating collection UserRoom on database
const usersRooms: Model<IUserRoom> = model('UsersRooms', UserRoomSchema)

export { usersRooms };