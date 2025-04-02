import React from 'react';
import {
  Box,
  Container,
  Flex,
  Text,
  Link,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  useBreakpointValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Team members with LinkedIn profile URLs
  const teamMembers = [
    { name: "Bryan A Fernandez", linkedin: "https://www.linkedin.com/in/bryanafernandez/" },
    { name: "Shamar Weekes", linkedin: "https://www.linkedin.com/in/shamar-weekes/" },
    { name: "Juan Lao Romero", linkedin: "https://www.linkedin.com/in/juan-lao-romero-020025265/" },
    { name: "Abhiram Bhogi", linkedin: "https://www.linkedin.com/in/abhiram-bhogi/" },
    { name: "Gavin Greene", linkedin: "https://www.linkedin.com/in/gavin-greene-b74576251/" }
  ];

  // GitHub repository URL
  const githubRepoUrl = "https://github.com/bryanfernandez-eng/password-manager";

  return (
    <MotionBox
      as="footer"
      mt="auto"
      py={8}
      borderTop="1px solid"
      borderColor="rgba(243, 243, 243, 0.1)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 8, md: 0 }}>
          {/* Logo & Copyright */}
          <VStack align={{ base: "center", md: "flex-start" }} spacing={4}>
            <Flex align="center">
              <Icon as={FaLock} color="flickr.pink" boxSize={5} mr={2} />
              <Text fontSize="xl" fontWeight="bold" color="flickr.lightGray">
                Password Manager
              </Text>
            </Flex>
            
            <Text color="gray.500" fontSize="sm">
              © {currentYear} Password Manager. All rights reserved.
            </Text>
            
            <Link 
              href={githubRepoUrl}
              isExternal
              display="flex"
              alignItems="center"
              color="flickr.lightGray"
              _hover={{ color: "flickr.pink" }}
              mt={2}
            >
              <Icon as={FaGithub} mr={2} />
              <Text>View on GitHub</Text>
            </Link>
          </VStack>

          <Box>
            {/* Team Members Section */}
            <VStack spacing={6} align={{ base: "center", md: "flex-start" }}>
              <Box width="100%">
                <Text fontWeight="semibold" mb={3} textAlign={{ base: "center", md: "left" }}>
                  Our Team
                </Text>
                <Wrap spacing={1} justify={{ base: "center", md: "flex-start" }}>
                  {teamMembers.map((member, index) => (
                    <WrapItem key={index}>
                      <Link 
                        href={member.linkedin}
                        isExternal
                        display="flex"
                        alignItems="center"
                        color="flickr.lightGray"
                        _hover={{ color: "flickr.pink" }}
                        px={2}
                        py={1}
                        borderRadius="md"
                        _hover={{ bg: "rgba(255, 0, 132, 0.1)" }}
                        transition="all 0.3s"
                      >
                        <Icon as={FaLinkedin} boxSize={4} mr={2} />
                        <Text fontSize="sm">{member.name}</Text>
                      </Link>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
              
              {/* Features Section */}
              <Box width="100%">
                <Text fontWeight="semibold" mb={3} textAlign={{ base: "center", md: "left" }}>
                  Features
                </Text>
                <Wrap spacing={4} justify={{ base: "center", md: "flex-start" }}>
                  <WrapItem>
                    <Link color="flickr.lightGray" _hover={{ color: "flickr.pink" }} fontSize="sm">Password Vault</Link>
                  </WrapItem>
                  <WrapItem>
                    <Link color="flickr.lightGray" _hover={{ color: "flickr.pink" }} fontSize="sm">Password Generator</Link>
                  </WrapItem>
                  <WrapItem>
                    <Link color="flickr.lightGray" _hover={{ color: "flickr.pink" }} fontSize="sm">Security Check</Link>
                  </WrapItem>
                  <WrapItem>
                    <Link color="flickr.lightGray" _hover={{ color: "flickr.pink" }} fontSize="sm">AI Assistant</Link>
                  </WrapItem>
                </Wrap>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </MotionBox>
  );
};

export default Footer;