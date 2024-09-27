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
    <div style={{ textAlign: "center", width: "100%", padding: "20px", boxSizing: "border-box", color: "white" }}>
      <h1>AI Chatbot</h1>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              maxWidth: "30%",
              minWidth: "30%",
              backgroundColor: message.bot === "yes" ? "lightgray" : "blue",
              borderRadius: "10px",
              padding: "10px",
              marginBottom: "5px",
              textAlign: "left",
              alignSelf: message.bot === "yes" ? "flex-start" : "flex-end", // Left for bot, right for user
            }}
          >
            <h5 style={{ marginBottom: "2px", marginTop: "5px" }}>
              {message.bot === "yes" ? "AI Chatbot" : message.name}
            </h5>
            <h4 style={{ margin: "0", marginBottom: "5px" }}>{message.message}</h4>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
          style={{
            width: "23%",
            padding: "10px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "white",
            color: "black",
            marginRight: "5px",
          }}
        />
        <button
          onClick={handleSubmit}
          aria-label="Send"
          style={{
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "20px",
            padding: "15px",
            width: "100px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#333";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "black";
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
