import React from 'react';
import { getUserColor } from './Message';
import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    {
      users
        ? (
          <div>
            <h1>People currently chatting:</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                    <div className="avatar" style={{backgroundColor: getUserColor(name)}}>
                      {name.trim()[0]}
                    </div>
                    <div className="userInfo">
                      {name}
                      <div className="onlineIconSmall"></div>
                    </div>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;
