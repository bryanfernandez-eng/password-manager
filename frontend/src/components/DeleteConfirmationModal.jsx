import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useColorMode,
  Box,
  Icon
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { colorMode } = useColorMode();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor={colorMode === "dark" ? "rgba(26, 32, 44, 0.95)" : "white"}
        color={colorMode === "dark" ? "gray.200" : "gray.800"}
        borderRadius="xl"
        padding={4}
      >
        <ModalHeader display="flex" alignItems="center">
          <Icon as={WarningTwoIcon} color="red.500" marginRight={3} boxSize={6} />
          {title || "Confirm Delete"}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Text>{message || "Are you sure you want to delete? This action cannot be undone."}</Text>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="red" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;