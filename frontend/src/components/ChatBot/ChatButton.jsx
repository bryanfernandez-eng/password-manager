import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionButton = motion(IconButton);

const ChatButton = ({ isOpen, onToggle }) => {
  return (
    <Tooltip label={isOpen ? "Close assistant" : "Open password assistant"}>
      <MotionButton
        position="fixed"
        bottom="20px"
        right="20px"
        size="lg"
        borderRadius="full"
        colorScheme="pink"
        bg="flickr.pink"
        color="white"
        icon={<ChatIcon />}
        onClick={onToggle}
        zIndex="1000"
        boxShadow="0 4px 8px rgba(0,0,0,0.2)"
        _hover={{ bg: "#E5007A" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      />
    </Tooltip>
  );
};

export default ChatButton;