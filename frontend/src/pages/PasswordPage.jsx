// src/pages/PasswordPage.jsx
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Text,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Divider,
  useBreakpointValue,
  Tag,
  Tooltip
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  SearchIcon, 
  AddIcon, 
  DeleteIcon, 
  ChevronDownIcon, 
  ViewIcon, 
  ViewOffIcon,
  CopyIcon,
  EditIcon,
  ExternalLinkIcon,
  LockIcon
} from "@chakra-ui/icons";
import PasswordEntryModal from "../components/PasswordEntryModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import passwordService from "../api/passwordService";

// Animated components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionTr = motion(Tr);
const MotionCard = motion(Card);

function PasswordPage() {
  const [showPasswords, setShowPasswords] = useState({});
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'siteName', direction: 'ascending' });
  const [passwordToDelete, setPasswordToDelete] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteModalOpen, 
    onOpen: openDeleteModal, 
    onClose: closeDeleteModal 
  } = useDisclosure();
  const {
    isOpen: isDeleteAllModalOpen,
    onOpen: openDeleteAllModal,
    onClose: closeDeleteAllModal
  } = useDisclosure();
  
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch passwords on component mount
  useEffect(() => {
    fetchPasswords();
  }, []);

  // Filter passwords based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPasswords(passwords);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const results = passwords.filter(password => 
      password.siteName.toLowerCase().includes(term) ||
      password.email.toLowerCase().includes(term) ||
      password.siteUrl.toLowerCase().includes(term)
    );
    
    setFilteredPasswords(results);
  }, [searchTerm, passwords]);

  const fetchPasswords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await passwordService.getAllPasswords();
      if (response.success) {
        setPasswords(response.data);
        setFilteredPasswords(response.data);
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
          const passwordIndex = passwords.findIndex(
            p => p.siteName === password.siteName && p.email === password.email
          );
          
          if (passwordIndex !== -1) {
            updatedPasswords[passwordIndex] = {
              ...updatedPasswords[passwordIndex],
              password: response.data.password,
            };
            setPasswords(updatedPasswords);
          }
          
          // Update filtered passwords as well
          const updatedFiltered = [...filteredPasswords];
          const filteredIndex = filteredPasswords.findIndex(
            p => p.siteName === password.siteName && p.email === password.email
          );
          
          if (filteredIndex !== -1) {
            updatedFiltered[filteredIndex] = {
              ...updatedFiltered[filteredIndex],
              password: response.data.password,
            };
            setFilteredPasswords(updatedFiltered);
          }
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
        await navigator.clipboard.writeText(response.data.password);
        toast({
          title: "Copied to clipboard",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
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
        title: "Failed to copy",
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
      const isEdit = currentPassword.originalSiteName && currentPassword.originalEmail;
  
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

  const confirmDelete = (password) => {
    setPasswordToDelete(password);
    openDeleteModal();
  };

  const handleDelete = async () => {
    if (!passwordToDelete) return;
    
    try {
      const response = await passwordService.deletePassword(
        passwordToDelete.siteName,
        passwordToDelete.email
      );

      if (response.success) {
        toast({
          title: "Password Deleted",
          description: "Successfully removed from your vault",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Refresh the password list
        fetchPasswords();
        closeDeleteModal();
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

  const handleDeleteAll = async () => {
    try {
      const response = await passwordService.deleteAllPasswords();

      if (response.success) {
        toast({
          title: "All Passwords Deleted",
          description: "Your vault has been cleared",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Refresh the password list (will now be empty)
        fetchPasswords();
        closeDeleteAllModal();
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

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredPasswords].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredPasswords(sortedData);
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="300px" width="100%">
        <Spinner 
          size="xl" 
          color="flickr.pink" 
          thickness="4px" 
          speed="0.65s"
          emptyColor="gray.700" 
        />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" mt={10}>
        <Alert status="error" variant="solid" borderRadius="md" bg="red.500">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Container>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      w="full"
    >
      <Container maxW="container.xl" py={8}>
        <MotionFlex 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          mb={8} 
          direction="column"
        >
          <Heading size="xl" mb={2} textAlign={{ base: "center", md: "left" }}>
            Password Vault
          </Heading>
          <Text color="flickr.lightGray" opacity={0.7} mb={6} textAlign={{ base: "center", md: "left" }}>
            Manage and secure your online credentials
          </Text>
          
          <Flex 
            direction={{ base: "column", md: "row" }} 
            justify="space-between" 
            align={{ base: "stretch", md: "center" }}
            gap={4}
          >
            <InputGroup maxW={{ base: "full", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.500" />
              </InputLeftElement>
              <Input 
                placeholder="Search passwords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="rgba(34, 34, 34, 0.7)"
                borderColor="rgba(243, 243, 243, 0.1)"
                _hover={{ borderColor: "rgba(243, 243, 243, 0.3)" }}
                _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
              />
            </InputGroup>
            
            <HStack spacing={3}>
              <Button 
                leftIcon={<AddIcon />} 
                onClick={handleAddNew}
                bg="flickr.pink"
                color="white"
                _hover={{ bg: "#E00077" }}
                size={{ base: "md", md: "md" }}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Password
              </Button>
              
              {filteredPasswords.length > 0 && (
                <IconButton
                  aria-label="Delete all passwords"
                  icon={<DeleteIcon />}
                  variant="outline"
                  borderColor="rgba(243, 243, 243, 0.2)"
                  color="flickr.lightGray"
                  _hover={{ 
                    bg: "rgba(255, 0, 132, 0.1)",
                    borderColor: "flickr.pink"
                  }}
                  onClick={openDeleteAllModal}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              )}
            </HStack>
          </Flex>
        </MotionFlex>

        {filteredPasswords.length === 0 ? (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            textAlign="center"
            py={16}
            px={4}
            borderRadius="md"
            bg="rgba(34, 34, 34, 0.7)"
            border="1px solid"
            borderColor="rgba(243, 243, 243, 0.1)"
          >
            <LockIcon boxSize={16} color="flickr.pink" mb={4} />
            <Heading size="md" mb={2}>No passwords found</Heading>
            <Text color="flickr.lightGray" opacity={0.7} mb={6}>
              {passwords.length === 0 
                ? "Your vault is empty. Add your first password to get started." 
                : "No passwords match your search criteria."}
            </Text>
            {passwords.length === 0 && (
              <Button
                onClick={handleAddNew}
                bg="flickr.pink"
                color="white"
                _hover={{ bg: "#E00077" }}
                size="md"
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Your First Password
              </Button>
            )}
          </MotionBox>
        ) : isMobile ? (
          // Mobile card view
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SimpleGrid 
              columns={1} 
              spacing={4}
              as={motion.div}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {filteredPasswords.map((password, index) => (
                <MotionCard
                  key={`${password.siteName}-${password.email}`}
                  bg="rgba(34, 34, 34, 0.8)"
                  borderColor="rgba(243, 243, 243, 0.1)"
                  borderRadius="md"
                  overflow="hidden"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ 
                    y: -2,
                    borderColor: "rgba(243, 243, 243, 0.3)"
                  }}
                >
                  <CardBody p={4}>
                    <Stack spacing={3}>
                      <Flex justify="space-between" align="center">
                        <Heading size="sm">{password.siteName}</Heading>
                        <Tooltip label={password.siteUrl}>
                          <Tag size="sm" colorScheme="blue" bg="flickr.blue" color="white">
                            {password.siteUrl}
                          </Tag>
                        </Tooltip>
                      </Flex>
                      
                      <Text fontSize="sm" color="flickr.lightGray" opacity={0.8}>
                        {password.email}
                      </Text>
                      
                      <Flex align="center">
                        <Text mr={2} fontWeight="medium" fontSize="sm">Password:</Text>
                        <Text flex={1} letterSpacing={1}>
                          {showPasswords[index] ? password.password : "••••••••"}
                        </Text>
                      </Flex>
                    </Stack>
                  </CardBody>
                  
                  <Divider borderColor="rgba(243, 243, 243, 0.1)" />
                  
                  <CardFooter p={3} justifyContent="space-between">
                    <HStack spacing={2}>
                      <IconButton
                        aria-label={showPasswords[index] ? "Hide password" : "Show password"}
                        icon={showPasswords[index] ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePasswordVisibility(index, password)}
                      />
                      <IconButton
                        aria-label="Copy password"
                        icon={<CopyIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(password.siteName, password.email)}
                      />
                    </HStack>
                    
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit password"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        color="flickr.blue"
                        onClick={() => handleEdit(password)}
                      />
                      <IconButton
                        aria-label="Delete password"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        color="flickr.pink"
                        onClick={() => confirmDelete(password)}
                      />
                    </HStack>
                  </CardFooter>
                </MotionCard>
              ))}
            </SimpleGrid>
          </MotionBox>
        ) : (
          // Desktop table view
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            overflow="hidden"
            borderRadius="md"
            border="1px solid"
            borderColor="rgba(243, 243, 243, 0.1)"
          >
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead bg="rgba(34, 34, 34, 0.8)">
                  <Tr>
                    <Th 
                      color="flickr.lightGray" 
                      onClick={() => handleSort('siteName')}
                      cursor="pointer"
                      _hover={{ color: "flickr.pink" }}
                      transition="color 0.2s"
                      borderColor="rgba(243, 243, 243, 0.1)"
                    >
                      Site Name {sortConfig.key === 'siteName' && (
                        sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                      )}
                    </Th>
                    <Th 
                      color="flickr.lightGray"
                      borderColor="rgba(243, 243, 243, 0.1)"
                    >
                      Site URL
                    </Th>
                    <Th 
                      color="flickr.lightGray"
                      onClick={() => handleSort('email')}
                      cursor="pointer"
                      _hover={{ color: "flickr.pink" }}
                      borderColor="rgba(243, 243, 243, 0.1)"
                    >
                      Email {sortConfig.key === 'email' && (
                        sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
                      )}
                    </Th>
                    <Th 
                      color="flickr.lightGray"
                      borderColor="rgba(243, 243, 243, 0.1)"
                    >
                      Password
                    </Th>
                    <Th 
                      color="flickr.lightGray" 
                      textAlign="center"
                      borderColor="rgba(243, 243, 243, 0.1)"
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPasswords.map((password, index) => (
                    <MotionTr
                      key={`${password.siteName}-${password.email}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      _hover={{ bg: "rgba(243, 243, 243, 0.05)" }}
                    >
                      <Td borderColor="rgba(243, 243, 243, 0.1)">{password.siteName}</Td>
                      <Td borderColor="rgba(243, 243, 243, 0.1)">
                        <Text 
                          color="flickr.blue"
                          as="a" 
                          href={password.siteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          display="flex"
                          alignItems="center"
                          _hover={{ color: "flickr.pink", textDecoration: "none" }}
                        >
                          {password.siteUrl}
                          <ExternalLinkIcon ml={1} boxSize={3} />
                        </Text>
                      </Td>
                      <Td borderColor="rgba(243, 243, 243, 0.1)">{password.email}</Td>
                      <Td borderColor="rgba(243, 243, 243, 0.1)" letterSpacing={1}>
                        {showPasswords[index] ? password.password : "••••••••"}
                      </Td>
                      <Td borderColor="rgba(243, 243, 243, 0.1)">
                        <Flex justify="center" gap={2}>
                          <Tooltip label={showPasswords[index] ? "Hide password" : "Show password"}>
                            <IconButton
                              icon={showPasswords[index] ? <ViewOffIcon /> : <ViewIcon />}
                              aria-label={showPasswords[index] ? "Hide password" : "Show password"}
                              size="sm"
                              variant="ghost"
                              color="flickr.lightGray"
                              _hover={{ color: "flickr.blue", bg: "rgba(0, 99, 220, 0.1)" }}
                              onClick={() => togglePasswordVisibility(index, password)}
                            />
                          </Tooltip>
                          <Tooltip label="Copy password">
                            <IconButton
                              icon={<CopyIcon />}
                              aria-label="Copy password"
                              size="sm"
                              variant="ghost"
                              color="flickr.lightGray"
                              _hover={{ color: "flickr.blue", bg: "rgba(0, 99, 220, 0.1)" }}
                              onClick={() => copyToClipboard(password.siteName, password.email)}
                            />
                          </Tooltip>
                          <Tooltip label="Edit password">
                            <IconButton
                              icon={<EditIcon />}
                              aria-label="Edit password"
                              size="sm"
                              variant="ghost"
                              color="flickr.lightGray"
                              _hover={{ color: "flickr.blue", bg: "rgba(0, 99, 220, 0.1)" }}
                              onClick={() => handleEdit(password)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete password">
                            <IconButton
                              icon={<DeleteIcon />}
                              aria-label="Delete password"
                              size="sm"
                              variant="ghost"
                              color="flickr.lightGray"
                              _hover={{ color: "flickr.pink", bg: "rgba(255, 0, 132, 0.1)" }}
                              onClick={() => confirmDelete(password)}
                            />
                          </Tooltip>
                        </Flex>
                      </Td>
                    </MotionTr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </MotionBox>
        )}
      </Container>

      {/* Password Entry Modal */}
      <PasswordEntryModal
        isOpen={isOpen}
        onClose={onClose}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        onSave={handleSave}
      />

      {/* Delete Single Password Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Password"
        message={`Are you sure you want to delete the password for ${passwordToDelete?.siteName}? This action cannot be undone.`}
      />

      {/* Delete All Passwords Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteAllModalOpen}
        onClose={closeDeleteAllModal}
        onConfirm={handleDeleteAll}
        title="Delete All Passwords"
        message="Are you sure you want to delete ALL passwords? This action cannot be undone and will remove all your saved passwords."
      />
    </MotionBox>
  );
}

export default PasswordPage;