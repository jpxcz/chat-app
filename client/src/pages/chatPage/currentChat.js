import React, { useState } from 'react';

const Chat = ({ chat, handleSendText, conversation = [] }) => {
  const [text, setText] = useState('');

  const sendText = () => {
    handleSendText(text);
    setText('');
  }
  return (
    <div className="current-chat">
      <h3>{chat || "Please select a chat group first"}</h3>
      <div className="history-chat">
        {
          conversation.map((c, idx) => {
            return (
              <div className="msg" key={idx}>
                <div className="user">{c.username}</div>
                <div className="text">{c.text}</div>
              </div>
            )
          })
        }
      </div>
      <div className="input">
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendText}>Send</button>
      </div>
    </div>
  )
}

export default Chat