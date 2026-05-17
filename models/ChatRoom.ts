// models/ChatRoom.ts
import { IChatRoom } from '@type'
import mongoose, { Schema, Model } from 'mongoose'

const ChatRoomSchema: Schema = new Schema<IChatRoom.Model>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  characterId: { type: Schema.Types.ObjectId, required: true, ref: 'Character' },
  userName: { type: String, required: true, maxlength: 50 },
  userSystem: { type: String, required: true, maxlength: 500 }
}, { timestamps: true })

const ChatRoom = (mongoose.models.ChatRoom as Model<IChatRoom.Model>) || mongoose.model<IChatRoom.Model>('ChatRoom', ChatRoomSchema)

export default ChatRoom
