import React, { useEffect, useState, useRef } from "react";
import { db } from "./config/firebase";
import {
  collection,
  query,
  setDoc,
  where,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { OpenAIApi, Configuration } from "openai";
import "./App.css";
import "./bot.css"

const Chat = () => {
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [messages, setMessages] = useState([]); // Store all messages here
  const [newMessage, setNewMessage] = useState("");
  const MessagesRef = collection(db, "messages");
  const name = localStorage.getItem("username");
  const messagesEndRef = useRef(null);

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: "",
    })
    // supposed to move all this to the backend. using nodejs for the backend
  );

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      setRedirectToDashboard(true);
    }
  }, []);

  // Function to handle the bot response
  async function main(newMessage) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `You are an AI chatbot for a medical health app. Reply to the following message: ${newMessage}`,
        },
      ],
      stream: false,
    });

    try {
      const generatedText = completion.data.choices[0].message.content;
      const newDoc = doc(MessagesRef);
      await setDoc(newDoc, {
        message: generatedText,
        name: name,
        time: serverTimestamp(),
        bot: "yes",
      });

      // Add bot's message to the array
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: newDoc.id, message: generatedText, name: "AI Chatbot", bot: "yes" },
      ]);
      scrollToBottom();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Handle scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch messages from Firestore in real-time
  useEffect(() => {
    const messagesQuery = query(MessagesRef, where("name", "==", name), orderBy("time", "asc"));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        scrollToBottom(); // Ensure we scroll to the bottom after fetching messages
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [MessagesRef, name]);

  // Handle user message submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const newDoc = doc(MessagesRef);
      const userMessage = {
        message: newMessage,
        name: name,
        time: serverTimestamp(),
        bot: "no",
      };

      // Optimistically update the UI before saving the message to Firestore
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: newDoc.id, ...userMessage },
      ]);
      setNewMessage(""); // Clear the input

      // Add user's message to Firestore
      await setDoc(newDoc, userMessage);

      // Send the message to the OpenAI bot
      main(newMessage);
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }

  return (
<div className="container chat-container">
  <h1 className="chat-title">AI Chatbot</h1>
  <div className="content messages-container">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`message-card ${message.bot === "yes" ? "bot-message" : "user-message"}`}
      >
        <h5 className="message-author">
          {message.bot === "yes" ? "AI Chatbot" : message.name}
        </h5>
        <h4 className="message-content">{message.message}</h4>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
  <div className="post-area input-container">
    <textarea
      placeholder="Type your message..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit(e);
        }
      }}
      className="message-input"
    />
    <button
      onClick={handleSubmit}
      aria-label="Send"
      className="send-button"
    >
      Send
    </button>
  </div>
</div>

  );
};

export default Chat;
