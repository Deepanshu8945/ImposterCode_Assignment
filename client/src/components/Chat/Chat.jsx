import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./Chat.css";

import InfoBar from "./components/InfoBar";
import Input from "./components/Input";
import Messages from "./components/Messages";
import TextContainer from "./components/TextContainer";
import TypingIndicator from "./components/TypingIndicator";


let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser , setTypingUser] = useState("");

  const ENDPOINT = "http://localhost:3001";

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get("name");
    const room = searchParams.get("room");

    setName(name);
    setRoom(room);

    socket = io(ENDPOINT);

    socket.emit("join_room", { username: name, room: room });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.search, ENDPOINT]);

  useEffect(() => {
    let typingTimeout = null;

    socket.on("receive_message", (message) => {
      setMessages((messages) => [...messages, message]);
      setTypingUser("");
      if (typingTimeout) clearTimeout(typingTimeout);
    });

    socket.on("display_typing", (username) => {
      setTypingUser(username);
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => setTypingUser(""), 3000);
    });

    socket.on("room_users", (users) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      const msgData = {
        room: room,
        author: name,
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", msgData);
      setMessages((messages) => [...messages, msgData]);
      setMessage("");
    }
  };

  const handleTyping = ()=>{
    socket.emit("typing", {room, name});
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <TypingIndicator name={typingUser} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          handleTyping = {handleTyping}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
