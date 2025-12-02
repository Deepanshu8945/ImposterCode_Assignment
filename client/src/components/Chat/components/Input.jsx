import React from 'react';
import './Input.css';

const Input = ({ message, setMessage, sendMessage, handleTyping }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={(event) => {
        setMessage(event.target.value);
        handleTyping();
      }}
    />
    <button className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>
  </form>
);

export default Input;
