import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getChatUsers,
  getConversations,
  getMessages,
  getOrCreateConversation,
  sendMessage
} from "../../services/chatService";
import LoadingSpinner from "./LoadingSpinner";

const getOtherParticipant = (conversation, userId) =>
  conversation.participants?.find((p) => String(p._id || p) !== String(userId));

const ChatPage = () => {
  const { user, socket } = useAuth();
  const userId = user?._id || user?.id;
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const loadInitial = async () => {
    try {
      const [userList, convList] = await Promise.all([getChatUsers(), getConversations()]);
      setUsers(userList);
      setConversations(convList);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toast.error(String(error));
    }
  };

  const refreshConversations = async () => {
    try {
      const convList = await getConversations();
      setConversations(convList);
    } catch {
      /* ignore background refresh errors */
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (!socket || !activeConversation?._id) return;
    socket.emit("chat:join", activeConversation._id);
    const onMessage = (message) => {
      if (String(message.conversation) !== String(activeConversation._id)) return;
      setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      setTimeout(scrollToBottom, 50);
    };
    const onNotify = () => refreshConversations();
    socket.on("chat:message", onMessage);
    socket.on("chat:notify", onNotify);
    return () => {
      socket.emit("chat:leave", activeConversation._id);
      socket.off("chat:message", onMessage);
      socket.off("chat:notify", onNotify);
    };
  }, [socket, activeConversation?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    await loadMessages(conversation._id);
  };

  const startChat = async (recipientId) => {
    try {
      const conversation = await getOrCreateConversation(recipientId);
      await refreshConversations();
      await openConversation(conversation);
    } catch (error) {
      toast.error(String(error));
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation) return;
    setSending(true);
    try {
      const message = await sendMessage(activeConversation._id, text.trim());
      setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      setText("");
      await refreshConversations();
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const activePeer = activeConversation ? getOtherParticipant(activeConversation, userId) : null;

  return (
    <div className="container py-4 chat-page">
      <div className="mb-4">
        <h2 className="mb-1">Messages</h2>
        <p className="text-muted mb-0">Chat in real time with candidates and recruiters.</p>
      </div>

      <div className="chat-layout card border-0 overflow-hidden">
        <div className="chat-sidebar">
          <div className="chat-sidebar-section">
            <h6 className="chat-sidebar-title">Recent Chats</h6>
            {conversations.length === 0 && <p className="chat-empty-note">No conversations yet.</p>}
            {conversations.map((conversation) => {
              const peer = getOtherParticipant(conversation, userId);
              const isActive = activeConversation?._id === conversation._id;
              return (
                <button
                  key={conversation._id}
                  type="button"
                  className={`chat-list-item ${isActive ? "active" : ""}`}
                  onClick={() => openConversation(conversation)}
                >
                  <span className="chat-list-name">{peer?.name || "User"}</span>
                  <span className="chat-list-preview">{conversation.lastMessage || "Start chatting"}</span>
                </button>
              );
            })}
          </div>

          <div className="chat-sidebar-section">
            <h6 className="chat-sidebar-title">Start New Chat</h6>
            {users.map((chatUser) => (
              <button
                key={chatUser._id}
                type="button"
                className="chat-list-item"
                onClick={() => startChat(chatUser._id)}
              >
                <span className="chat-list-name">{chatUser.name}</span>
                <span className="chat-list-preview">{chatUser.role} · {chatUser.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {activeConversation ? (
            <>
              <div className="chat-main-header">
                <div>
                  <h5 className="mb-0">{activePeer?.name}</h5>
                  <small className="text-muted">{activePeer?.role} · {activePeer?.email}</small>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((message) => {
                  const senderId = message.sender?._id || message.sender;
                  const isMine = String(senderId) === String(userId);
                  return (
                    <div key={message._id} className={`chat-bubble-wrap ${isMine ? "mine" : "theirs"}`}>
                      <div className="chat-bubble">
                        {!isMine && <span className="chat-bubble-author">{message.sender?.name}</span>}
                        <p>{message.text}</p>
                        <span className="chat-bubble-time">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-bar" onSubmit={handleSend}>
                <input
                  className="form-control"
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="btn btn-primary" type="submit" disabled={sending || !text.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder">
              <h5>Select a conversation</h5>
              <p className="text-muted mb-0">Choose a recent chat or start a new one from the sidebar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
