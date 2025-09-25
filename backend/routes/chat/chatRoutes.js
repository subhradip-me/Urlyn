import express from 'express';
import {
  getUserChats,
  getChatMessages,
  createDirectMessage,
  createGroupChat,
  createItemChat,
  addChatMember,
  removeChatMember,
  updateChatSettings,
  deleteChat
} from '../../controllers/chat/chatController.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication to all chat routes
router.use(protect);

// Chat management routes
router.route('/')
  .get(getUserChats); // Get all user chats

router.route('/dm')
  .post(createDirectMessage); // Create direct message

router.route('/group')
  .post(createGroupChat); // Create group chat

router.route('/item')
  .post(createItemChat); // Create item-based chat

router.route('/:chatId/messages')
  .get(getChatMessages); // Get chat messages

router.route('/:chatId/members')
  .post(addChatMember); // Add member to chat

router.route('/:chatId/members/:memberId')
  .delete(removeChatMember); // Remove member from chat

router.route('/:chatId/settings')
  .put(updateChatSettings); // Update chat settings

router.route('/:chatId')
  .delete(deleteChat); // Delete/Archive chat

export default router;
