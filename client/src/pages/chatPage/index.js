import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Finder from './chatFinder';
import Chat from './currentChat';
import { Socket } from '../../config/socket';
import './Chats.scss';

const ChatPage = (props) => {
  const [currentChat, setCurrentChat] = useState(null); // current visible chat

  useEffect(() => {
    Socket.emit('attach-socket', props.user);
    Socket.on('message', data => {
      console.log(data);
    })
  }, []);

  const getChat = async (chat) => {
    try {
      const response = await fetch('/api/get-channel', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: props.user, chatId: chat })
      });

      if (!response.ok && response.status !== 200) {
        console.warn("Could not get chat")
        return;
      }

      setCurrentChat(chat);
    } catch (err) {
      console.log(err)
      console.warn("Something went wrong on getting the chat");
    }
  }

  const sendText = async (text) => {
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: props.user, chatId: currentChat, message: text })
      });

      if (!response.ok && response.status !== 200) {
        console.warn("Could not send message")
        return;
      }
    } catch (err) {
      console.log(err)
      console.warn("Something went wrong sending the message");
    }
  }

  return (
    <div className="chats">
      <h2>Welcome {props.user}</h2>
      <div className="chat-window">
        <Finder setCurrentChat={getChat} />
        <Chat chat={currentChat} handleSendText={sendText} />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(ChatPage);