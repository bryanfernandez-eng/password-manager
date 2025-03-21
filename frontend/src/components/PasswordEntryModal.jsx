import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";

function PasswordEntryModal({
  isOpen,
  onClose,
  currentPassword,
  setCurrentPassword,
  onSave,
}) {
  const toast = useToast();

  const handleSave = () => {
    // Validate inputs
    if (
      !currentPassword?.siteName ||
      !currentPassword?.siteUrl ||
      !currentPassword?.email ||
      !currentPassword?.password
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    onSave();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="rgba(26, 32, 44, 0.95)"
        color="gray.200"
        padding={5}
        borderRadius={"xl"}
      >
          <ModalHeader>
            {currentPassword ? "Edit Password" : "Add New Password"}
          </ModalHeader>
          <ModalCloseButton m={6} />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Site Name</FormLabel>
            <Input
              value={currentPassword?.siteName || ""}
              onChange={(e) =>
                setCurrentPassword((prev) => ({
                  ...prev,
                  siteName: e.target.value,
                }))
              }
              placeholder="Enter site name"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Site URL</FormLabel>
            <Input
              value={currentPassword?.siteUrl || ""}
              onChange={(e) =>
                setCurrentPassword((prev) => ({
                  ...prev,
                  siteUrl: e.target.value,
                }))
              }
              placeholder="Enter site URL"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={currentPassword?.email || ""}
              onChange={(e) =>
                setCurrentPassword((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="Enter email"
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={currentPassword?.password || ""}
              onChange={(e) =>
                setCurrentPassword((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Enter password"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent={"center"}>
          <Button colorScheme="blue" width={"full"} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
        
      </ModalContent>
      
    </Modal>
  );
}

export default PasswordEntryModal;
