//  Loading database modules
import { model, Schema, Model, Document, Types } from 'mongoose';

interface ITalk extends Document {
  roomId: Types.ObjectId,
  messageId: [Types.ObjectId]
  creationAt: Date;
  updateAt: Date;
}

//	Defining Talk schema
const TalkSchema: Schema = new Schema({
  roomId: {
    type: [Types.ObjectId],
    ref: 'Rooms'
  },
  messageId: {
    type: Types.ObjectId,
    ref: 'Messages'
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

//	Creating collection Talks on database
const talks: Model<ITalk> = model('Talks', TalkSchema)

export { talks };