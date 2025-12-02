import React from 'react';
import { getUserColor } from './Message';
import './TypingIndicator.css';

const TypingIndicator = ({ name }) => {
  if (!name) return null;

  return (
    <div className="typingContainer">
      <div className="typingAvatar" style={{ backgroundColor: getUserColor(name) }}>
        {name.trim()[0]}
      </div>
      <div className="typingBubble">
        <div className="typingDot"></div>
        <div className="typingDot"></div>
        <div className="typingDot"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
