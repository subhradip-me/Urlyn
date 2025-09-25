import asyncHandler from 'express-async-handler';
import Chat from '../../models/chat/Chat.js';
import Message from '../../models/chat/Message.js';
import User from '../../models/common/User.js';
import Note from '../../models/core/Note.js';

// @desc    Get all user chats
// @route   GET /api/chats
// @access  Private
const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const chats = await Chat.find({
    'members.userId': userId,
    isActive: true
  })
  .populate('members.userId', 'firstName lastName email avatar isOnline lastSeen')
  .populate('itemId', 'title description')
  .sort({ lastMessageAt: -1 });

  // Get last message for each chat
  const chatsWithLastMessage = await Promise.all(
    chats.map(async (chat) => {
      const lastMessage = await Message.findOne({
        chatId: chat._id,
        isDeleted: false
      })
      .populate('senderId', 'firstName lastName')
      .sort({ createdAt: -1 });

      const chatObj = chat.toObject();
      chatObj.lastMessage = lastMessage;
      
      // Calculate unread count for current user
      const member = chat.members.find(m => m.userId._id.toString() === userId);
      const unreadCount = await Message.getUnreadCount(
        chat._id, 
        userId, 
        member?.lastReadAt
      );
      chatObj.unreadCount = unreadCount;

      return chatObj;
    })
  );

  res.json({
    success: true,
    data: chatsWithLastMessage
  });
});

// @desc    Get chat messages
// @route   GET /api/chats/:chatId/messages
// @access  Private
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.user.id;

  // Verify user is member of chat
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  const isMember = chat.members.some(member => 
    member.userId.toString() === userId
  );

  if (!isMember) {
    res.status(403);
    throw new Error('Access denied');
  }

  const messages = await Message.getChatMessages(chatId, parseInt(page), parseInt(limit));

  res.json({
    success: true,
    data: {
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Message.countDocuments({ chatId, isDeleted: false })
      }
    }
  });
});

// @desc    Create direct message chat
// @route   POST /api/chats/dm
// @access  Private
const createDirectMessage = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const userId = req.user.id;

  if (userId === recipientId) {
    res.status(400);
    throw new Error('Cannot create DM with yourself');
  }

  // Check if recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  // Create or get existing DM
  const chat = await Chat.createDMChat(userId, recipientId);
  await chat.populate('members.userId', 'firstName lastName email avatar isOnline');

  res.status(201).json({
    success: true,
    data: chat
  });
});

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
const createGroupChat = asyncHandler(async (req, res) => {
  const { name, description, members } = req.body;
  const userId = req.user.id;

  if (!name || !Array.isArray(members) || members.length === 0) {
    res.status(400);
    throw new Error('Name and members are required');
  }

  // Verify all members exist
  const validMembers = await User.find({ _id: { $in: members } });
  if (validMembers.length !== members.length) {
    res.status(400);
    throw new Error('Some members not found');
  }

  const chat = new Chat({
    type: 'group',
    name,
    description,
    createdBy: userId,
    members: [
      { userId, role: 'admin' },
      ...members.map(memberId => ({ userId: memberId, role: 'member' }))
    ]
  });

  await chat.save();
  await chat.populate('members.userId', 'firstName lastName email avatar isOnline');

  res.status(201).json({
    success: true,
    data: chat
  });
});

// @desc    Create item chat (for shared notes, bookmarks, etc.)
// @route   POST /api/chats/item
// @access  Private
const createItemChat = asyncHandler(async (req, res) => {
  const { itemId, itemType, members = [] } = req.body;
  const userId = req.user.id;

  if (!itemId || !itemType) {
    res.status(400);
    throw new Error('Item ID and type are required');
  }

  // Verify item exists and user has access
  let item;
  switch (itemType) {
    case 'note':
      item = await Note.findById(itemId);
      break;
    // Add other item types as needed
    default:
      res.status(400);
      throw new Error('Invalid item type');
  }

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if item chat already exists
  const existingChat = await Chat.findOne({
    type: 'item',
    itemId,
    itemType,
    isActive: true
  });

  if (existingChat) {
    await existingChat.populate('members.userId', 'firstName lastName email avatar isOnline');
    return res.json({
      success: true,
      data: existingChat
    });
  }

  const chat = await Chat.createItemChat(itemId, itemType, userId, members);
  await chat.populate('members.userId', 'firstName lastName email avatar isOnline');

  res.status(201).json({
    success: true,
    data: chat
  });
});

// @desc    Add member to group chat
// @route   POST /api/chats/:chatId/members
// @access  Private
const addChatMember = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { userId: newMemberId, role = 'member' } = req.body;
  const userId = req.user.id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Check if user is admin
  const currentMember = chat.members.find(m => m.userId.toString() === userId);
  if (!currentMember || currentMember.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can add members');
  }

  // Check if new member exists
  const newMember = await User.findById(newMemberId);
  if (!newMember) {
    res.status(404);
    throw new Error('User not found');
  }

  const added = chat.addMember(newMemberId, role);
  if (!added) {
    res.status(400);
    throw new Error('User is already a member');
  }

  await chat.save();
  await chat.populate('members.userId', 'firstName lastName email avatar isOnline');

  res.json({
    success: true,
    data: chat,
    message: 'Member added successfully'
  });
});

// @desc    Remove member from group chat
// @route   DELETE /api/chats/:chatId/members/:memberId
// @access  Private
const removeChatMember = asyncHandler(async (req, res) => {
  const { chatId, memberId } = req.params;
  const userId = req.user.id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Check if user is admin or removing themselves
  const currentMember = chat.members.find(m => m.userId.toString() === userId);
  const isAdmin = currentMember && currentMember.role === 'admin';
  const isSelf = userId === memberId;

  if (!isAdmin && !isSelf) {
    res.status(403);
    throw new Error('Not authorized to remove this member');
  }

  chat.removeMember(memberId);
  await chat.save();

  res.json({
    success: true,
    message: 'Member removed successfully'
  });
});

// @desc    Update chat settings
// @route   PUT /api/chats/:chatId/settings
// @access  Private
const updateChatSettings = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { name, description, settings } = req.body;
  const userId = req.user.id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Check if user is admin
  const member = chat.members.find(m => m.userId.toString() === userId);
  if (!member || member.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can update chat settings');
  }

  if (name) chat.name = name;
  if (description !== undefined) chat.description = description;
  if (settings) {
    chat.settings = { ...chat.settings, ...settings };
  }

  await chat.save();

  res.json({
    success: true,
    data: chat,
    message: 'Chat settings updated successfully'
  });
});

// @desc    Delete/Archive chat
// @route   DELETE /api/chats/:chatId
// @access  Private
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  // Check if user is admin or if it's a DM
  if (chat.type === 'dm') {
    // For DM, just remove user from members
    chat.removeMember(userId);
    if (chat.members.length === 0) {
      chat.isActive = false;
    }
  } else {
    // For group chats, only admins can delete
    const member = chat.members.find(m => m.userId.toString() === userId);
    if (!member || member.role !== 'admin') {
      res.status(403);
      throw new Error('Only admins can delete this chat');
    }
    chat.isActive = false;
  }

  await chat.save();

  res.json({
    success: true,
    message: 'Chat deleted successfully'
  });
});

export {
  getUserChats,
  getChatMessages,
  createDirectMessage,
  createGroupChat,
  createItemChat,
  addChatMember,
  removeChatMember,
  updateChatSettings,
  deleteChat
};
