// models/ChatMessage.ts
import { IChatMessage } from '@type'
import mongoose, { Schema, Model } from 'mongoose'

const ChatMessageSchema: Schema = new Schema<IChatMessage.Model>({
  ChatRoomId: { type: Schema.Types.ObjectId, required: true, ref: 'ChatRoom' },
  role: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true })

const ChatMessage = (mongoose.models.ChatMessage as Model<IChatMessage.Model>) || mongoose.model<IChatMessage.Model>('ChatMessage', ChatMessageSchema)

export default ChatMessage
