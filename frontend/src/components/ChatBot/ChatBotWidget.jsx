import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import { useUser } from '../../context/UserContext';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatButton isOpen={isOpen} onToggle={toggleChat} />
      <ChatWindow isOpen={isOpen} onClose={toggleChat} />
    </>
  );
};

export default ChatbotWidget;