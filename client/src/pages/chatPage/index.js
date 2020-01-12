import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Finder from './chatFinder';
import Chat from './currentChat';
import { Socket } from '../../config/socket';
import './Chats.scss';

const ChatPage = (props) => {
  const [currentChat, setCurrentChat] = useState(null); // current visible chat
  const [conversation, setConversation] = useState([]);
  useEffect(() => {
    Socket.emit('attach-socket', props.user);

  }, []);

  useEffect(() => {
    Socket.on('message', data => {
      console.log(data);
      console.log(currentChat);
      console.log(data.chatId === currentChat)
      if (data.chatId === currentChat) {
        setConversation(current => [...current, JSON.parse(data.message)])
      }
      // else would leave the posibility to have notification on other followed conversations 

    });
  }, [currentChat]);
  
  const getChat = async (chat) => {
    if (chat !== currentChat) {
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
        setConversation([]);
        setCurrentChat(chat);
      } catch (err) {
        console.log(err)
        console.warn("Something went wrong on getting the chat");
      }
    }
  }

  const sendText = async (text) => {
    if (currentChat && text.length) {
      try {
        const response = await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chatId: currentChat, message: { username: props.user, text: text } })
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
  }

  return (
    <div className="chats">
      <h2>Welcome {props.user}</h2>
      <div className="chat-window">
        <Finder setCurrentChat={getChat} />
        <Chat chat={currentChat} handleSendText={sendText} conversation={conversation} />
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