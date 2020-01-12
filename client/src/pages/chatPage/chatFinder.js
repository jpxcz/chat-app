import React, { useState } from 'react';

const Finder = ({ setCurrentChat }) => {
  const [chat, setChat] = useState('');
  const [chatList, setChatList] = useState(['1', '2', '3']);

  const filterChats = (e) => {
    const val = e.target.value;
    // setChatList(current => current.filter(c => c.includes(val)));
    setChat(val)
  }

  const getChat = (value) => {
    setChat('');
    setCurrentChat(value);
  }

  const filteredList = chatList.filter(c => c.includes(chat))
  return (
    <div className="finder">
      <input value={chat} onChange={filterChats} placeholder="find chat"/>
      <div className="chat-list">
        Current Chats
        {
          filteredList.length ?
            filteredList.map((c) => {
              return <button key={c} className="element" onClick={() => getChat(c)}>{c}</button>
            })
            : <button onClick={() => getChat(chat)}>create new chat</button>
        }
      </div>
    </div>
  )
}

export default Finder;