// frontend/src/pages/PasswordPage.jsx
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Container,
  Button,
  Text,
  Flex,
  useToast,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  useColorMode,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import PasswordEntryModal from "../components/PasswordEntryModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import passwordService from "../api/passwordService";
import { DeleteIcon } from "@chakra-ui/icons";

function PasswordPage() {
  const [showPasswords, setShowPasswords] = useState({});
  const [passwords, setPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteModalOpen, 
    onOpen: openDeleteModal, 
    onClose: closeDeleteModal 
  } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();

  // Fetch passwords on component mount
  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await passwordService.getAllPasswords();
      if (response.success) {
        setPasswords(response.data);
      } else {
        setError(response.message || "Failed to load passwords");
      }
    } catch (error) {
      console.error("Error fetching passwords:", error);
      setError(error.message || "Failed to load passwords");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = async (index, password) => {
    if (!showPasswords[index]) {
      // Only fetch the real password if we're showing it
      try {
        const response = await passwordService.getPassword(
          password.siteName,
          password.email
        );

        if (response.success) {
          // Create a new array with the updated password
          const updatedPasswords = [...passwords];
          updatedPasswords[index] = {
            ...updatedPasswords[index],
            password: response.data.password,
          };
          setPasswords(updatedPasswords);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to retrieve password",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to retrieve password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    setShowPasswords((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = async (siteName, email) => {
    try {
      const response = await passwordService.getPassword(siteName, email);

      if (response.success && response.data) {
        navigator.clipboard.writeText(response.data.password).then(() => {
          toast({
            title: "Copied to Clipboard",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to retrieve password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: error.message || "Error retrieving password",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (password) => {
    try {
      // Fetch the actual password before editing
      const response = await passwordService.getPassword(
        password.siteName, 
        password.email
      );
      
      if (response.success) {
        // Store the original siteName and email for reference when saving edits
        setCurrentPassword({
          ...response.data,
          originalSiteName: password.siteName,
          originalEmail: password.email
        });
        onOpen();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to retrieve password details",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to retrieve password details",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };
  
  const handleAddNew = () => {
    setCurrentPassword({
      siteName: "",
      siteUrl: "",
      email: "",
      password: "",
    });
    onOpen();
  };

  const handleSave = async () => {
    try {
      // Check if this is a new password or an update
      const isEdit = passwords.some(p => 
        p.siteName === currentPassword.originalSiteName && 
        p.email === currentPassword.originalEmail
      );
  
      let response;
      if (isEdit) {
        // Use the edit endpoint
        response = await passwordService.editPassword(
          currentPassword.originalSiteName,
          currentPassword.originalEmail,
          {
            siteName: currentPassword.siteName,
            siteUrl: currentPassword.siteUrl,
            email: currentPassword.email,
            password: currentPassword.password,
            notes: currentPassword.notes || ""
          }
        );
      } else {
        // Add a new password
        response = await passwordService.addPassword({
          siteName: currentPassword.siteName,
          siteUrl: currentPassword.siteUrl,
          email: currentPassword.email,
          password: currentPassword.password,
          notes: currentPassword.notes || ""
        });
      }
      
      if (response.success) {
        toast({
          title: isEdit ? "Password Updated" : "Password Added",
          description: isEdit ? 
            "Your password has been updated successfully" : 
            "Your password has been added successfully",
          status: "success",
          duration: 2000,
          isClosable: true
        });
        
        // Refresh the password list
        fetchPasswords();
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save password",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save password",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (passwordToDelete) => {
    try {
      const response = await passwordService.deletePassword(
        passwordToDelete.siteName,
        passwordToDelete.email
      );

      if (response.success) {
        toast({
          title: "Deleted",
          description: "Password deleted successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Refresh the password list
        fetchPasswords();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const executeDeleteAll = async () => {
    try {
      const response = await passwordService.deleteAllPasswords();

      if (response.success) {
        toast({
          title: "All Passwords Deleted",
          description: "All your passwords have been deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Refresh the password list (will now be empty)
        fetchPasswords();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete all passwords",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting all passwords:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete all passwords",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" mt={10}>
        <Flex justify="center" align="center" height="300px">
          <Spinner size="xl" color={colorMode === "dark" ? "gray.300" : "gray.600"} />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" mt={10}>
        <Alert status="error" variant="solid" borderRadius="md">
          <AlertIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxW="container.xl" mt={10}>
        <Flex mb={4} justifyContent="space-between">
          {passwords.length > 0 && (
            <Button
              colorScheme="red"
              onClick={openDeleteModal}
              variant="outline"
              leftIcon={<DeleteIcon />}
            >
              Delete All Passwords
            </Button>
          )}
          <Button colorScheme="green" onClick={handleAddNew}>
            Add New Password
          </Button>
        </Flex>
        <Box
          p={4}
          borderRadius="md"
          backgroundColor={colorMode === "dark" ? "rgba(26, 32, 44, 0.7)" : "white"}
          color={colorMode === "dark" ? "gray.200" : "gray.800"}
          boxShadow="lg"
        >
          {passwords.length === 0 ? (
            <Flex justify="center" align="center" height="200px">
              <Text fontSize="xl">No saved passwords</Text>
            </Flex>
          ) : (
            <TableContainer>
              <Table size="lg" variant="simple">
                <Thead>
                  <Tr>
                    <Th color={colorMode === "dark" ? "gray.200" : "gray.700"}>Site Name</Th>
                    <Th color={colorMode === "dark" ? "gray.200" : "gray.700"}>Site URL</Th>
                    <Th color={colorMode === "dark" ? "gray.200" : "gray.700"}>Email</Th>
                    <Th color={colorMode === "dark" ? "gray.200" : "gray.700"}>Password</Th>
                    <Th color={colorMode === "dark" ? "gray.200" : "gray.700"} textAlign="center">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {passwords.map((password, index) => (
                    <Tr
                      key={`${password.siteName}-${password.email}-${index}`}
                      _hover={{
                        bg: colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.50",
                        transition: "background-color 0.2s ease-in-out",
                      }}
                    >
                      <Td borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}>{password.siteName}</Td>
                      <Td borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}>
                        <a
                          href={password.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: colorMode === "dark" ? "#4299E1" : "#3182CE",
                            textDecoration: "underline",
                            transition: "color 0.2s ease-in-out",
                          }}
                        >
                          {password.siteUrl}
                        </a>
                      </Td>
                      <Td borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}>{password.email}</Td>
                      <Td borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}>
                        {showPasswords[index] ? password.password : "••••••••"}
                      </Td>
                      <Td borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}>
                        <Flex gap={2} justify="center">
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            onClick={() =>
                              togglePasswordVisibility(index, password)
                            }
                          >
                            {showPasswords[index] ? "Hide" : "Show"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="green"
                            onClick={() =>
                              copyToClipboard(password.siteName, password.email)
                            }
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="yellow"
                            onClick={() => handleEdit(password)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            onClick={() => handleDelete(password)}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>

      {/* Modal for Adding/Editing Password */}
      <PasswordEntryModal
        isOpen={isOpen}
        onClose={onClose}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDeleteAll}
        title="Delete All Passwords"
        message="Are you sure you want to delete ALL passwords? This action cannot be undone and will remove all your saved passwords."
      />
    </>
  );
}

export default PasswordPage;