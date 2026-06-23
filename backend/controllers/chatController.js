import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getIo } from "../utils/socket.js";
 
// Small reusable helper used across this file to check whether a given
// userId is one of the two people inside a conversation's participants array.
// We compare String(p) === String(userId) because Mongoose ObjectId instances
// are not === equal even when they represent the same value, so we normalize
// both sides to plain strings before comparing.
const isParticipant = (conversation, userId) =>
  conversation.participants.some((p) => String(p) === String(userId));
 
// GET /api/chat/users
// Returns every user in the system EXCEPT the currently logged-in one.
// Used by the frontend to populate a "start a new chat with..." contact list.
export const getChatUsers = async (req, res) => {
  // $ne = "not equal" -> exclude the logged-in user's own id from results
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select("name email role") // never leak password hash or other sensitive fields
    .sort({ name: 1 }); // alphabetical, ascending
  res.json(users);
};
 
// GET /api/chat/conversations
// Returns all conversations the logged-in user is part of, most recently
// active first. Each conversation's participants are populated so the
// frontend can show names/emails without a second round trip.
export const getConversations = async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "name email role")
    .sort({ lastMessageAt: -1 }); // most recent activity first
  res.json(conversations);
};
 
// POST /api/chat/conversations
// "Get or create" pattern: if a 1-on-1 conversation between the logged-in
// user and recipientId already exists, return it. Otherwise create a new one.
export const getOrCreateConversation = async (req, res) => {
  const { recipientId } = req.body;
 
  // Basic input validation before touching the database at all
  if (!recipientId) return res.status(400).json({ message: "Recipient is required" });
 
  // Prevent a user from starting a "conversation" with themselves
  if (String(recipientId) === String(req.user._id)) {
    return res.status(400).json({ message: "Cannot chat with yourself" });
  }
 
  // Make sure the recipient actually exists before creating anything
  const recipient = await User.findById(recipientId).select("name email role");
  if (!recipient) return res.status(404).json({ message: "User not found" });
 
  // Look for an existing conversation that contains EXACTLY these two people.
  // $all checks both ids are present (in any order).
  // $size: 2 ensures the array has no third participant -- otherwise $all
  // alone could incorrectly match a group conversation that happens to
  // include both of these users plus someone else.
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId], $size: 2 }
  }).populate("participants", "name email role");
 
  // No existing conversation found -> create a fresh one
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId]
    });
    // Populate after creation so the response shape matches the "found" branch above
    conversation = await conversation.populate("participants", "name email role");
  }
 
  res.json(conversation);
};
 
// GET /api/chat/conversations/:id/messages
// Returns all messages in a conversation, oldest first (so the chat renders
// top-to-bottom in natural reading order).
export const getMessages = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });
 
  // Access control: only the two participants can read this conversation's messages
  if (!isParticipant(conversation, req.user._id)) {
    return res.status(403).json({ message: "Not a participant in this conversation" });
  }
 
  const messages = await Message.find({ conversation: req.params.id })
    .populate("sender", "name email role")
    .sort({ createdAt: 1 }); // ascending -> oldest message first
  res.json(messages);
};
 
// POST /api/chat/conversations/:id/messages
// Sends a new message into a conversation, updates the conversation's
// "preview" fields, and pushes real-time events over Socket.IO.
export const sendMessage = async (req, res) => {
  const { text } = req.body;
 
  // text?.trim() guards against text being undefined/null (optional chaining),
  // and also rejects whitespace-only messages
  if (!text?.trim()) return res.status(400).json({ message: "Message text is required" });
 
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });
 
  // Same access control as getMessages -- only participants can send here
  if (!isParticipant(conversation, req.user._id)) {
    return res.status(403).json({ message: "Not a participant in this conversation" });
  }
 
  // Create the actual message document
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: text.trim()
  });
 
  // Denormalized "preview" fields stored directly on the Conversation document.
  // This lets getConversations() show a chat list with last-message previews
  // WITHOUT having to query the Message collection separately for every
  // conversation on every page load -- cheaper reads at the cost of a tiny
  // bit of duplicated data.
  conversation.lastMessage = text.trim();
  conversation.lastMessageAt = new Date();
  await conversation.save();
 
  // Populate sender info before sending the message back / broadcasting it
  const populated = await message.populate("sender", "name email role");
 
  const io = getIo();
 
  // Room 1: "conversation:<id>" -- anyone currently viewing THIS conversation's
  // chat window receives the full message live (assumes the client joins this
  // room when opening the chat screen).
  io?.to(`conversation:${conversation._id}`).emit("chat:message", populated);
 
  // Room 2: "user:<id>" for EACH participant -- a more general "you have a new
  // message" notification. This reaches a participant even if they are not
  // currently looking at this specific conversation (e.g. for an unread badge).
  conversation.participants.forEach((participantId) => {
    io?.to(`user:${participantId}`).emit("chat:notify", {
      conversationId: conversation._id,
      message: populated
    });
  });
 
  res.status(201).json(populated);
};
 
// Not an Express route handler (no req/res) -- a plain helper function meant
// to be called from elsewhere, most likely your Socket.IO connection logic,
// to verify a user is allowed to join a "conversation:<id>" room BEFORE
// letting them subscribe to it. Without this check, anyone could join any
// conversation's room just by knowing/guessing its id and silently read
// private messages in real time.
export const verifyConversationAccess = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !isParticipant(conversation, userId)) return null;
  return conversation;
};
 