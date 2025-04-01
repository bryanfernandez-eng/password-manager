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
  Box,
} from "@chakra-ui/react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

function PasswordEntryModal({
  isOpen,
  onClose,
  currentPassword,
  setCurrentPassword,
  onSave,
}) {
  const toast = useToast();

  const handleSave = () => {
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
        backgroundColor="flickr.darkGray" 
        color="flickr.lightGray"
        padding={5}
        borderRadius={"xl"}
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.5)"
      >
          <ModalHeader>
            {currentPassword ? 
              (currentPassword.originalSiteName ? "Edit Password" : "Add New Password") 
              : "Add New Password"}
          </ModalHeader>
          <ModalCloseButton m={6} color="flickr.lightGray" />
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
              borderColor="gray.600"
              _hover={{ borderColor: "flickr.pink" }}
              _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
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
              borderColor="gray.600"
              _hover={{ borderColor: "flickr.pink" }}
              _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
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
              borderColor="gray.600"
              _hover={{ borderColor: "flickr.pink" }}
              _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
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
              borderColor="gray.600"
              _hover={{ borderColor: "flickr.pink" }}
              _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
            />
          </FormControl>
          
          {/* Password Strength Meter */}
          <Box mt={4} mb={4}>
            <PasswordStrengthMeter password={currentPassword?.password || ""} />
          </Box>
        </ModalBody>

        <ModalFooter justifyContent={"center"}>
          <Button 
            backgroundColor="flickr.pink"
            color="white"
            width={"full"} 
            onClick={handleSave}
            _hover={{ backgroundColor: "#E5007A" }} // Slightly darker pink on hover
            transition="background-color 0.3s"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PasswordEntryModal;