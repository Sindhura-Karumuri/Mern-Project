import React, { useState, useEffect, useRef, useContext } from "react";
import API from "../api";
import { AuthContext } from "../AuthContext";
import "../styles/Chatbot.css";

const BOT = "bot";
const USER = "user";

const QUICK_REPLIES = [
  "Show menu 🍽️",
  "Show plans 💳",
  "My subscription ✅",
  "My orders 📦",
  "Opening hours 🕒",
  "How to order? 🛒",
  "Payment methods 💳",
  "Contact us 📞",
  "About us ℹ️",
];

function getBotReply(input, { menu, plans, orders, user, mySubscription }) {
  const msg = input.toLowerCase().trim();

  // Greetings
  if (/^(hi+|hello+|hey+|good\s*(morning|evening|afternoon|night)|howdy|helo|sup|what'?s up|whats up|namaste|hiya)/.test(msg)) {
    return user
      ? `Hey ${user.name.split(" ")[0]}! 👋 Welcome back to AromaOfEmotions. How can I help you today?`
      : "Hey there! 👋 Welcome to AromaOfEmotions. I can help you explore our menu, meal plans, and more. What would you like to know?";
  }

  // About
  if (/about|who are you|what is this|tell me about|what('?s| is) aroma/.test(msg)) {
    return "🍴 AromaOfEmotions is your campus canteen management system!\n\nWe offer:\n• Fresh daily meals\n• Flexible meal plans\n• Online ordering & payments\n• Quick service\n\nFounded in 2020, we serve 500+ orders daily with a 4.9★ rating!";
  }

  // How to order — check before generic order/menu patterns
  if (/how.*(order|buy|purchase|get food)|place.*order|steps.*(order|buy)|ordering process/.test(msg)) {
    return "🛒 How to place an order:\n\n1️⃣ Login to your account\n2️⃣ Browse the Menu section\n3️⃣ Click 'Order' on any item\n4️⃣ Complete payment via Razorpay\n5️⃣ Your order will be confirmed instantly! ✅";
  }

  // My subscription — check before generic plan pattern
  if (/my (plan|subscription)|my current plan|am i subscribed|subscribed plan|active (plan|subscription)|which plan|current subscription/.test(msg)) {
    if (!user) return "Please login to check your subscription. 🔐";
    if (mySubscription === undefined) return "Fetching your subscription details... ⏳ Please try again in a moment!";
    if (!mySubscription) return "You don't have an active subscription yet. 💳\n\nCheck out our available plans below and subscribe to enjoy daily meals!";
    return `✅ Your active subscription:\n\n📦 ${mySubscription.name}\n💰 ₹${mySubscription.price}\n📅 Duration: ${mySubscription.duration || mySubscription.duration_in_days} days\n\nVisit the Meal Plans section to manage your subscription!`;
  }

  // Plans — show all available plans
  if (/\bplan|subscription|subscribe|meal\s*plan|package|monthly|weekly|daily\s*meal/.test(msg)) {
    if (!plans.length) return "Meal plans are loading. Please try again shortly! 💳";
    const list = plans.map((p) => `• ${p.name} — ₹${p.price} for ${p.duration || p.duration_in_days} days`).join("\n");
    return `💳 We have ${plans.length} meal plan(s):\n\n${list}\n\nSubscribe from the Meal Plans section to enjoy daily meals without hassle!`;
  }

  // Orders history
  if (/my order|order history|past order|previous order|track.*order|order.*status|what.*order|show.*order|purchase/.test(msg)) {
    if (!user) return "Please login to view your orders. 🔐 Head to the Login page to get started!";
    if (!orders.length) return "You haven't placed any orders yet. 🧾 Browse our menu and place your first order!";
    const recent = orders.slice(-3).reverse();
    const list = recent.map((o) => `• ${o.items.map((i) => i.name).join(", ")} — ₹${o.totalAmount} (${o.status})`).join("\n");
    return `📦 Your recent orders:\n\n${list}\n\nVisit the Dashboard for full order history.`;
  }

  // Price / cheap / affordable
  if (/price|cost|cheap|affordable|expensive|budget|how much|lowest|best deal|value/.test(msg)) {
    if (!menu.length) return "Menu is loading, please try again shortly!";
    const sorted = [...menu].sort((a, b) => a.price - b.price);
    const cheap = sorted.slice(0, 3).map((i) => `• ${i.name} — ₹${i.price}`).join("\n");
    return `💰 Our most affordable items:\n\n${cheap}\n\nPrices start from just ₹${sorted[0].price}!`;
  }

  // Recommendations / popular / best
  if (/recommend|popular|best|top|favourite|favorite|special|must try|trending|rated/.test(msg)) {
    if (!menu.length) return "Menu is loading, please try again shortly!";
    const picks = menu.slice(0, 3).map((i) => `• ${i.name} — ₹${i.price}`);
    return `⭐ Some of our popular picks:\n\n${picks.join("\n")}\n\nCheck the full menu for more options!`;
  }

  // Breakfast / lunch / dinner / today's special
  if (/breakfast|lunch|dinner|brunch|snack|today.*special|special.*today|today.*menu/.test(msg)) {
    if (!menu.length) return "Menu is loading, please try again shortly!";
    const category = menu.find((i) => i.category?.toLowerCase().includes(
      msg.includes("breakfast") ? "breakfast" : msg.includes("lunch") ? "lunch" : msg.includes("dinner") ? "dinner" : ""
    ));
    const preview = menu.slice(0, 4).map((i) => `• ${i.name} — ₹${i.price}`).join("\n");
    return `🍽️ Here's what we have:\n\n${preview}\n\nVisit the Menu section to see everything!`;
  }

  // Veg / non-veg
  if (/\bveg\b|vegetarian|non.?veg|meat|chicken|paneer|\begg\b/.test(msg)) {
    const veg = menu.filter((i) => /veg|paneer|dal|rice|dosa|idli|bread|salad/i.test(i.name));
    const nonveg = menu.filter((i) => /chicken|mutton|fish|egg|meat/i.test(i.name));
    return `🥗 We have options for everyone!\n\n🟢 Veg items: ${veg.length || "several"}\n🔴 Non-veg items: ${nonveg.length || "several"}\n\nCheck the full menu to explore all options!`;
  }

  // Menu / food items
  if (/menu|food|eat|dish|item|available|what.*serve|what.*have|show.*food|i want|can i (get|have|order)|i('d| would) like/.test(msg)) {
    if (!menu.length) return "Our menu is loading. Please try again in a moment! 🍽️";
    const categories = [...new Set(menu.map((i) => i.category).filter(Boolean))];
    const preview = menu.slice(0, 5).map((i) => `• ${i.name} — ₹${i.price}`).join("\n");
    return `🍽️ We have ${menu.length} items${categories.length ? ` across: ${categories.join(", ")}` : ""}.\n\nHere's a quick preview:\n${preview}\n\nHead to the menu section to see everything and place an order!`;
  }

  // Specific food search — after all keyword checks to avoid false positives
  const foodMatch = menu.find((i) => {
    const name = i.name.toLowerCase();
    return name.length > 3 && msg.includes(name);
  });
  if (foodMatch) {
    return `🍴 ${foodMatch.name}\n💰 Price: ₹${foodMatch.price}\n🏷️ Category: ${foodMatch.category || "General"}\n\nYou can order it from the Menu section!`;
  }

  // Hours / timing
  if (/hour|timing|time|open|clos|when|schedule|working/.test(msg)) {
    return "🕒 Our operating hours:\n\n• Mon–Fri: 7:00 AM – 8:00 PM\n• Saturday: 8:00 AM – 6:00 PM\n• Sunday: 9:00 AM – 5:00 PM\n\nOnline ordering is available 24/7 for advance orders!";
  }

  // Payment methods
  if (/pay|payment|razorpay|upi|card|method|gpay|phonepe|net.?bank|wallet/.test(msg)) {
    return "💳 We accept all major payment methods via Razorpay:\n\n• Credit & Debit Cards\n• UPI (Google Pay, PhonePe, etc.)\n• Net Banking\n• Wallets\n\nAll transactions are secure and encrypted! 🔒";
  }

  // Refund / cancel
  if (/refund|cancel|return|money back|chargeback/.test(msg)) {
    return "↩️ Refund & Cancellation Policy:\n\n• Orders can be cancelled within 15 minutes of placing\n• Meal plan refunds available within 7 days if unused\n• Contact our support team for assistance\n\nReach us at info@aromaofemotions.com 📧";
  }

  // Delivery / location
  if (/deliver|delivery|bring|campus|location|where|pickup|pick.?up|counter/.test(msg)) {
    return "🚀 We currently serve within the campus premises. You can pick up your order from Counter A or B based on the item type. Delivery to hostels is available for meal plan subscribers!";
  }

  // Contact / support / help
  if (/contact|email|phone|reach|support|help|issue|problem|complaint/.test(msg)) {
    return "📞 Contact AromaOfEmotions:\n\n📧 info@aromaofemotions.com\n📱 +91 98765 43210\n📍 Campus Block A, Ground Floor\n\nOr visit our Contact page for more options!";
  }

  // Thanks
  if (/thank|thanks|\bty\b|great|awesome|nice|perfect|wonderful|excellent|cool/.test(msg)) {
    return "You're welcome! 😊 Is there anything else I can help you with?";
  }

  // Bye
  if (/bye|goodbye|see you|cya|later|take care|good night/.test(msg)) {
    return "Goodbye! 👋 Come back whenever you're hungry. Enjoy your meal! 🍽️";
  }

  // Fallback
  return "I'm not sure about that! 🤔 Here are some things I can help with:\n\n• Browse the menu\n• View meal plans\n• Check your orders\n• Payment info\n• Opening hours\n\nTry asking something from the options below!";
}

export default function Chatbot() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: BOT,
      text: "Hi there! 👋 I'm AromaBot, your canteen assistant. Ask me anything about our menu, plans, orders, or timings!",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mySubscription, setMySubscription] = useState(undefined); // undefined = not fetched yet
  const bottomRef = useRef(null);

  // Fetch data for smart responses
  useEffect(() => {
    API.get("/menu").then((r) => setMenu(r.data || [])).catch(() => {});
    API.get("/plans").then((r) => setPlans(r.data || [])).catch(() => {});
    if (user) {
      API.get("/orders/my").then((r) => setOrders(r.data || [])).catch(() => {});
      API.get("/plans/my").then((r) => setMySubscription(r.data)).catch(() => setMySubscription(null));
    } else {
      setMySubscription(null);
    }
  }, [user]);

  // Auto scroll to bottom
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");

    const userMsg = { role: USER, text: userText, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(userText, { menu, plans, orders, user, mySubscription });
      setMessages((prev) => [...prev, { role: BOT, text: reply, time: new Date() }]);
      setTyping(false);
    }, 700);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating Button */}
      <button className={`chat-fab${open ? " chat-fab-open" : ""}`} onClick={() => setOpen(!open)} aria-label="Chat">
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        )}
        {!open && <span className="chat-fab-badge">1</span>}
      </button>

      {/* Chat Window */}
      <div className={`chat-window${open ? " chat-window-open" : ""}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">🍴</div>
            <div>
              <div className="chat-bot-name">AromaBot</div>
              <div className="chat-bot-status">
                <span className="status-dot" />
                Online — Canteen Assistant
              </div>
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg-row ${msg.role === USER ? "chat-msg-user" : "chat-msg-bot"}`}>
              {msg.role === BOT && <div className="chat-msg-avatar">🍴</div>}
              <div className="chat-msg-bubble-wrap">
                <div className="chat-msg-bubble">{msg.text}</div>
                <div className="chat-msg-time">{formatTime(msg.time)}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="chat-msg-row chat-msg-bot">
              <div className="chat-msg-avatar">🍴</div>
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        <div className="chat-quick-replies">
          {QUICK_REPLIES.map((q) => (
            <button key={q} className="quick-reply-btn" onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything..."
            maxLength={200}
          />
          <button className="chat-send-btn" onClick={() => sendMessage()} disabled={!input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
