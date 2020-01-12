import React, { useState } from 'react';

const Chat = ({chat, handleSendText}) => {
  const [text, setText] = useState('');

  const sendText = () => {
    handleSendText(text);
    setText('');
  }
  return (
    <div className="current-chat">
      <h3>{chat}</h3>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendText}>Send</button>
  </div>
  )
}

export default Chat