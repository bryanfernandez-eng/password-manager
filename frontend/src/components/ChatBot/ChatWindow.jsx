import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  IconButton,
  Text,
  VStack,
  HStack,
  Avatar,
  useToast,
  CloseButton,
  Collapse,
  Heading,
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import backend from '../../api/db';
import ChatMessage from './ChatMessage';

const MotionBox = motion(Box);

const ChatWindow = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: "Hello! I'm your password assistant. How can I help you today?", isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const updatedHistory = [
      ...chatHistory,
      { text: message, isUser: true }
    ];
    
    setChatHistory(updatedHistory);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await backend.post('/chatbot/message', {
        message,
        chatHistory: chatHistory
      });

      if (response.data.success) {
        // Add bot response to chat
        setChatHistory([
          ...updatedHistory,
          { text: response.data.response, isUser: false }
        ]);
      } else {
        // Handle error in response
        setChatHistory([
          ...updatedHistory,
          { text: "I'm sorry, I encountered an error. Please try again later.", isUser: false }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from assistant',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      setChatHistory([
        ...updatedHistory,
        { text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Collapse in={isOpen} animateOpacity>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        position="fixed"
        bottom="20px"
        right="20px"
        width={{ base: "90%", md: "350px" }}
        height="500px"
        bg="rgba(34, 34, 34, 0.95)"
        borderRadius="md"
        boxShadow="0 4px 12px rgba(0,0,0,0.3)"
        border="1px solid"
        borderColor="gray.700"
        zIndex="1000"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Chat Header */}
        <Flex 
          bg="flickr.darkGray" 
          p={3} 
          borderBottom="1px solid" 
          borderColor="gray.700"
          justify="space-between"
          align="center"
        >
          <HStack>
            <Avatar size="sm" bg="flickr.pink" name="Assistant" />
            <Heading size="sm" color="white">Password Assistant</Heading>
          </HStack>
          <CloseButton color="gray.400" onClick={onClose} />
        </Flex>
        
        {/* Chat Messages */}
        <VStack 
          flex="1" 
          overflowY="auto" 
          p={4} 
          spacing={4}
          align="stretch"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.500',
              borderRadius: '24px',
            },
          }}
        >
          {chatHistory.map((msg, index) => (
            <ChatMessage 
              key={index} 
              message={msg.text} 
              isUser={msg.isUser} 
            />
          ))}
          <div ref={messagesEndRef} />
        </VStack>
        
        {/* Chat Input */}
        <HStack 
          p={3} 
          borderTop="1px solid" 
          borderColor="gray.700"
          spacing={2}
        >
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.600"
            _hover={{ borderColor: "flickr.pink" }}
            _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
          />
          <IconButton
            icon={<ArrowUpIcon />}
            colorScheme="pink"
            variant="solid"
            isLoading={isLoading}
            onClick={handleSendMessage}
            aria-label="Send message"
          />
        </HStack>
      </MotionBox>
    </Collapse>
  );
};

export default ChatWindow;