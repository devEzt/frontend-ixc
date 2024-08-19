export interface Message {
  content: string
  sender: string
  receiver: string
  timestamp: any
  _id: string
}

export interface User {
  status: string
  _id: string
  name: string
}

export interface Conversation {
  userId: string
  name: string
  lastMessage: string
}
