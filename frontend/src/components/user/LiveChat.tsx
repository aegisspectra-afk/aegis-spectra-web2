"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Minimize2, Maximize2, Phone, Mail } from "lucide-react";
import { useToastContext } from "@/components/ToastProvider";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

interface LiveChatProps {
  userEmail?: string;
}

export function LiveChat({ userEmail }: LiveChatProps) {
  const { showToast } = useToastContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem(`chat_history_${userEmail}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })));
      } catch (e) {
        console.error("Error loading chat history:", e);
      }
    }
  }, [userEmail]);

  const saveMessages = (newMessages: Message[]) => {
    if (userEmail) {
      localStorage.setItem(`chat_history_${userEmail}`, JSON.stringify(newMessages));
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputMessage("");
    setIsTyping(true);

    // Simulate support response (in production, this would be a real API call)
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "תודה על פנייתך! נציג שירות לקוחות יצור איתך קשר בהקדם. אתה יכול גם ליצור קשר ישירות ב-WhatsApp או בטלפון.",
        sender: "support",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, supportMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      setIsTyping(false);
    }, 2000);
  };

  const handleWhatsApp = () => {
    const phoneNumber = "972559737025";
    const message = encodeURIComponent("שלום! אני מעוניין לקבל עזרה.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handlePhone = () => {
    window.open("tel:+972559737025", "_self");
  };

  const handleEmail = () => {
    window.open("mailto:aegisspectra@gmail.com?subject=פנייה לתמיכה", "_self");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-gold text-black rounded-full p-4 shadow-lg hover:bg-gold/90 transition flex items-center gap-2"
      >
        <MessageSquare className="size-6" />
        <span className="font-semibold">צ&apos;אט חי</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 bg-charcoal border border-zinc-800 rounded-2xl shadow-2xl transition-all ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-black/30 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-gold" />
          <h3 className="font-semibold text-white">צ&apos;אט חי</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-800 rounded transition"
          >
            {isMinimized ? (
              <Maximize2 className="size-4 text-zinc-400" />
            ) : (
              <Minimize2 className="size-4 text-zinc-400" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-zinc-800 rounded transition"
          >
            <X className="size-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-zinc-400 py-8">
                <p>שלום! איך נוכל לעזור לך היום?</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 transition text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="size-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={handlePhone}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition text-sm flex items-center justify-center gap-2"
                  >
                    <Phone className="size-4" />
                    טלפון: +972-55-973-7025
                  </button>
                  <button
                    onClick={handleEmail}
                    className="w-full px-4 py-2 rounded-lg bg-gold/20 border border-gold/50 text-gold hover:bg-gold/30 transition text-sm flex items-center justify-center gap-2"
                  >
                    <Mail className="size-4" />
                    אימייל
                  </button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-gold text-black"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800 bg-black/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="הקלד הודעה..."
                className="flex-1 bg-black/30 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold/70"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

