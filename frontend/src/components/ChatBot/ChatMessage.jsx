import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, isUser }) => (
  <Flex justify={isUser ? 'flex-end' : 'flex-start'} mb={2} w="100%">
    <Box
      maxW="80%"
      bg={isUser ? 'flickr.blue' : 'gray.700'}
      color="white"
      borderRadius="lg"
      px={4}
      py={2}
      as={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!isUser && (
        <Text fontWeight="bold" fontSize="xs" mb={1} color="flickr.pink">
          Password Assistant
        </Text>
      )}
      <Text fontSize="sm">{message}</Text>
    </Box>
  </Flex>
);

export default ChatMessage;