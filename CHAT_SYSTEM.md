# 💬 Real-Time Chat System

A comprehensive real-time chat system built with Socket.IO, React, and MongoDB for the Urlyn 2.0 learning platform.

## 🚀 Features

### 🎯 Chat Types
- **Item-Level Chat**: Discussion threads for shared content (notes, bookmarks, folders)
- **Direct Messages**: Private 1:1 conversations between users
- **Group Chats**: Multi-user collaborative chat rooms

### ⚡ Real-Time Features
- **Instant Messaging**: Real-time message delivery via Socket.IO
- **Typing Indicators**: See when others are typing
- **Read Receipts**: Know when messages have been read
- **Online Status**: Live user presence indicators
- **Unread Counters**: Never miss important messages
- **Message Reactions**: React to messages with emojis

### 🛡️ Security & Permissions
- **JWT Authentication**: Secure socket connections
- **Role-based Access Control**: Admin/member permissions for group chats
- **Data Validation**: Input sanitization and validation
- **CORS Protection**: Secure cross-origin requests

## 🏗️ Architecture

### Backend Components

#### 📋 Database Schema

**Chat Collection:**
```javascript
{
  _id: ObjectId,
  type: 'item' | 'dm' | 'group',
  itemId: ObjectId, // Reference to shared item (nullable)
  itemType: 'note' | 'bookmark' | 'folder' | 'project',
  name: String, // For group chats
  members: [{
    userId: ObjectId,
    role: 'admin' | 'member',
    joinedAt: Date,
    lastReadAt: Date
  }],
  createdBy: ObjectId,
  settings: {
    allowFileSharing: Boolean,
    maxFileSize: Number,
    allowedFileTypes: [String]
  },
  lastMessageAt: Date,
  messageCount: Number,
  isActive: Boolean
}
```

**Message Collection:**
```javascript
{
  _id: ObjectId,
  chatId: ObjectId,
  senderId: ObjectId,
  message: String,
  messageType: 'text' | 'file' | 'image' | 'system',
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  replyTo: ObjectId, // Reference to replied message
  reactions: [{
    userId: ObjectId,
    reaction: String, // emoji
    reactedAt: Date
  }],
  readBy: [{
    userId: ObjectId,
    readAt: Date
  }],
  edited: {
    isEdited: Boolean,
    editedAt: Date,
    originalMessage: String
  },
  isDeleted: Boolean
}
```

#### 🔌 Socket.IO Events

**Connection Events:**
- `connect` - User connects to chat server
- `disconnect` - User disconnects from chat server
- `connect_error` - Connection error handling

**Chat Management:**
- `join_chat(chatId)` - Join a specific chat room
- `leave_chat(chatId)` - Leave a chat room
- `user_chats` - Receive user's chat list

**Messaging:**
- `send_message(chatId, message, attachments, replyTo)` - Send a message
- `new_message` - Receive new message in chat
- `edit_message(messageId, newMessage)` - Edit a message
- `delete_message(messageId)` - Delete a message

**Real-Time Indicators:**
- `typing_start(chatId)` - Start typing indicator
- `typing_stop(chatId)` - Stop typing indicator
- `user_typing` - Receive typing notification
- `user_stopped_typing` - Receive stop typing notification

**Message Status:**
- `read_message(chatId, messageId)` - Mark message as read
- `message_read` - Receive read receipt
- `react_to_message(messageId, reaction)` - Add reaction to message
- `message_reaction` - Receive message reaction

**User Presence:**
- `user_status_change` - Receive user online/offline status
- `user_joined_chat` - User joined chat notification
- `user_left_chat` - User left chat notification

#### 🛠️ API Endpoints

```
GET    /api/chats                    # Get user's chats
GET    /api/chats/:chatId/messages   # Get chat messages (paginated)
POST   /api/chats/dm                 # Create direct message
POST   /api/chats/group              # Create group chat
POST   /api/chats/item               # Create item-based chat
POST   /api/chats/:chatId/members    # Add member to chat
DELETE /api/chats/:chatId/members/:memberId # Remove member
PUT    /api/chats/:chatId/settings   # Update chat settings
DELETE /api/chats/:chatId            # Delete/archive chat
```

### Frontend Components

#### 🎨 React Components

**ChatProvider Context:**
- Manages global chat state
- Handles Socket.IO connection
- Real-time event handling
- Message and chat management

**ChatWidget:**
- Compact floating chat interface
- Chat list with search functionality
- Message display with typing indicators
- Message input with file attachment support

**ChatButton:**
- Global chat access button
- Unread message counter
- Connection status indicator

#### 🔄 State Management

```javascript
// Chat Context State
{
  socket: Socket | null,
  isConnected: boolean,
  chats: Chat[],
  activeChat: Chat | null,
  messages: { [chatId: string]: Message[] },
  typingUsers: { [chatId: string]: { [userId: string]: User } },
  unreadCounts: { [chatId: string]: number },
  onlineUsers: Set<string>
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+
- NPM or Yarn

### Installation

1. **Install Backend Dependencies:**
```bash
cd backend
npm install socket.io express-async-handler
```

2. **Install Frontend Dependencies:**
```bash
cd ../
npm install socket.io-client
```

3. **Environment Variables:**

Backend `.env`:
```env
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/urlyn
PORT=5001
FRONTEND_URL=http://localhost:3000
```

Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

### Running the Application

1. **Start Backend:**
```bash
cd backend
npm run dev
```

2. **Start Frontend:**
```bash
cd ../
npm run dev
```

3. **Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- Socket.IO: http://localhost:5001

## 💡 Usage

### Creating Chats

#### Item-Level Chat (Automatic)
```javascript
// Click chat icon on any shared note
const handleStartChat = (noteId) => {
  setSelectedNoteForChat(noteId);
  setChatOpen(true);
};
```

#### Direct Message
```javascript
const { createDirectMessage } = useChat();
const chat = await createDirectMessage(recipientId);
```

#### Group Chat
```javascript
const { createGroupChat } = useChat();
await createGroupChat("Study Group", "Math study group", [userId1, userId2]);
```

### Sending Messages

```javascript
const { sendMessage } = useChat();

// Text message
sendMessage(chatId, "Hello everyone!");

// Message with attachments
sendMessage(chatId, "Check this out!", [attachmentObject]);

// Reply to message
sendMessage(chatId, "Great point!", [], replyToMessageId);
```

### Real-Time Features

```javascript
const { startTyping, stopTyping, markMessageAsRead, reactToMessage } = useChat();

// Typing indicators
startTyping(chatId);
setTimeout(() => stopTyping(chatId), 2000);

// Mark as read
markMessageAsRead(chatId, messageId);

// Add reaction
reactToMessage(messageId, "👍");
```

## 🔧 Customization

### Theme Integration
The chat system uses your existing UI component library:
- `Button`, `Input`, `Badge` from `@/components/ui`
- `Avatar`, `ScrollArea`, `Card` components
- Responsive design with Tailwind CSS

### Notification Sounds
Add notification sounds to `public/notification-sound.mp3`:
```javascript
const playNotificationSound = () => {
  const audio = new Audio('/notification-sound.mp3');
  audio.volume = 0.3;
  audio.play();
};
```

## 📊 Performance Considerations

### Backend Optimizations
- **Database Indexing**: Optimized queries for chat and message collections
- **Connection Management**: Efficient Socket.IO room management
- **Memory Management**: Cleanup for disconnected users
- **Rate Limiting**: Prevent spam and abuse

### Frontend Optimizations
- **Lazy Loading**: Messages loaded on demand
- **Virtual Scrolling**: For large message lists
- **Connection Recovery**: Automatic reconnection with exponential backoff
- **State Management**: Optimized React context updates

## 🔮 Future Enhancements

### Planned Features
- [ ] **File Upload**: Direct file and image sharing
- [ ] **Voice Messages**: Audio message recording
- [ ] **Video Calls**: WebRTC integration
- [ ] **Message Search**: Full-text search across conversations
- [ ] **Push Notifications**: Browser and mobile notifications
- [ ] **Message Threading**: Threaded conversations
- [ ] **Chat Analytics**: Message metrics and insights
- [ ] **Moderation Tools**: Admin controls and content filtering

### Scalability Roadmap
- [ ] **Redis Integration**: Pub/sub for multiple server instances
- [ ] **Microservices**: Separate chat service
- [ ] **CDN Integration**: File upload and delivery
- [ ] **Database Sharding**: Horizontal scaling
- [ ] **Load Balancing**: Multiple Socket.IO instances

## 🐛 Troubleshooting

### Common Issues

**Socket Connection Errors:**
```bash
# Check if backend is running
curl http://localhost:5001/health

# Verify JWT token in localStorage
console.log(localStorage.getItem('token'))
```

**Database Connection:**
```bash
# Check MongoDB connection
mongosh
use urlyn
db.chats.find()
```

**CORS Issues:**
```javascript
// Verify CORS settings in server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true
};
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) - Real-time communication
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
