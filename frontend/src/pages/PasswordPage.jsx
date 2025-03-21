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
  useDisclosure
} from "@chakra-ui/react"
import { useState } from "react";
import PasswordEntryModal from "../components/PasswordEntryModal";


function PasswordPage() {
  const [showPasswords, setShowPasswords] = useState({});
  const [dummyPasswords, setDummyPasswords] = useState([
    { 
      siteName: "Gmail", 
      siteUrl: "https://gmail.com", 
      email: "johndoe@gmail.com", 
      password: "Str0ngP@ssw0rd123!" 
    },
    { 
      siteName: "GitHub", 
      siteUrl: "https://github.com", 
      email: "johndoe@github.com", 
      password: "DevCode2023!" 
    },
    { 
      siteName: "Dropbox", 
      siteUrl: "https://dropbox.com", 
      email: "johndoe@dropbox.com", 
      password: "CloudStorage2023#" 
    },
    { 
      siteName: "LinkedIn", 
      siteUrl: "https://linkedin.com", 
      email: "johndoe@linkedin.com", 
      password: "ProNetwork2023$" 
    }
  ]);
  const [currentPassword, setCurrentPassword] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const togglePasswordVisibility = (index) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        status: "success",
        duration: 2000,
        isClosable: true
      });
    }).catch(err => {
      toast({
        title: "Failed to Copy",
        description: err.message,
        status: "error",
        duration: 2000,
        isClosable: true
      });
    });
  };

  const handleEdit = (password) => {
    setCurrentPassword(password);
    onOpen();
  };

  const handleAddNew = () => {
    setCurrentPassword({
      siteName: '',
      siteUrl: '',
      email: '',
      password: ''
    });
    onOpen();
  };

  const handleSave = () => {
    // If editing an existing password
    if (dummyPasswords.find(p => 
      p.siteName === currentPassword.siteName && 
      p.email === currentPassword.email
    )) {
      setDummyPasswords(prev => prev.map(p => 
        p.siteName === currentPassword.siteName && p.email === currentPassword.email 
          ? currentPassword 
          : p
      ));
    } else {
      // If adding a new password
      setDummyPasswords(prev => [...prev, currentPassword]);
    }

    onClose();
    toast({
      title: "Success",
      description: "Password saved successfully",
      status: "success",
      duration: 2000,
      isClosable: true
    });
  };

  const handleDelete = (passwordToDelete) => {
    setDummyPasswords(prev => 
      prev.filter(p => 
        p.siteName !== passwordToDelete.siteName || 
        p.email !== passwordToDelete.email
      )
    );
    toast({
      title: "Deleted",
      description: "Password deleted successfully",
      status: "success",
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <>
      <Container maxW="container.xl" mt={10}>
        <Flex mb={4} justifyContent="flex-end">
          <Button 
            colorScheme="green" 
            onClick={handleAddNew}
          >
            Add New Password
          </Button>
        </Flex>
        <Box 
          p={4} 
          borderRadius="md"
          backgroundColor="rgba(26, 32, 44, 0.7)" 
          color="gray.200"
          boxShadow="lg"
        >
          {dummyPasswords.length === 0 ? (
            <Flex justify="center" align="center" height="200px">
              <Text fontSize="xl">No saved passwords</Text>
            </Flex>
          ) : (
            <TableContainer>
              <Table size="lg" variant="simple">
                <Thead>
                  <Tr>
                    <Th color="gray.200">Site Name</Th>
                    <Th color="gray.200">Site URL</Th>
                    <Th color="gray.200">Email</Th>
                    <Th color="gray.200">Password</Th>
                    <Th color="gray.200" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {dummyPasswords.map((password, index) => (
                    <Tr 
                      key={`${password.siteName}-${password.email}`} 
                      _hover={{ 
                        bg: "whiteAlpha.100",
                        transition: "background-color 0.2s ease-in-out"
                      }}
                    >
                      <Td borderColor="gray.600">{password.siteName}</Td>
                      <Td borderColor="gray.600">
                        <a 
                          href={password.siteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#4299E1', 
                            textDecoration: 'underline',
                            transition: 'color 0.2s ease-in-out'
                          }}
                        >
                          {password.siteUrl}
                        </a>
                      </Td>
                      <Td borderColor="gray.600">{password.email}</Td>
                      <Td borderColor="gray.600">
                        {showPasswords[index] 
                          ? password.password 
                          : '*'.repeat(password.password.length)
                        }
                      </Td>
                      <Td borderColor="gray.600">
                        <Flex gap={2} justify="center">
                          <Button 
                            size="sm" 
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => togglePasswordVisibility(index)}
                          >
                            {showPasswords[index] ? 'Hide' : 'Show'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            colorScheme="green"
                            onClick={() => copyToClipboard(password.password)}
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
    </>
  )
}

export default PasswordPage;