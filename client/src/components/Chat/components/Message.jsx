import React from 'react';
import './Message.css';

export const getUserColor = (username)=>{
  let hash = 0;
  for(let i = 0; i < username.length; i++){
    hash += username.charCodeAt(i);
  }
  const color = `hsl(${hash % 360}, 60%, 40%)`;
  return color;
}

const Message = ({ message: { text, author, message }, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();
  const msgAuthor = author ? author.trim().toLowerCase() : 'system';
  const msgText = message || text;

  if(msgAuthor === trimmedName) {
    isSentByCurrentUser = true;
  }

  if (msgAuthor === 'system') {
    return (
      <div className="messageContainer justifyCenter">
        <p className="sentText pl-10 pr-10">{msgText}</p>
      </div>
    );
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue" style={{backgroundColor: getUserColor(trimmedName)}}>
            <p className="messageText colorWhite">{msgText}</p>
          </div>
        </div>
        )
      : (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight" style={{backgroundColor: getUserColor(msgAuthor)}} >
            <p className="messageText colorDark">{msgText}</p>
          </div>
          <p className="sentText pl-10 ">{msgAuthor}</p>
        </div>
        )
  );
}

export default Message;
