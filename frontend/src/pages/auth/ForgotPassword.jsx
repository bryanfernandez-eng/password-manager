import React, { useState } from "react";
import {
  Box, 
  Button, 
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text, 
  useToast,
  Stack,
  Icon,
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { EmailIcon } from "@chakra-ui/icons";
import backend from "../../api/db";

// Animated components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await backend.post("/auth/forgot-password", { email });
      
      if (response.data.success) {
        setIsSubmitted(true);
        toast({
          title: "Reset Code Sent",
          description: "If your email exists in our system, you will receive a reset code",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset code. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container centerContent pt={{ base: 12, md: 20 }} color="flickr.lightGray">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        width={{ base: "90%", sm: "400px" }}
        maxW="500px"
      >
        <MotionFlex
          direction="column"
          align="center"
          mb={6}
        >
          <Icon
            as={EmailIcon}
            boxSize={12}
            color="flickr.pink"
            mb={4}
          />
          <Heading size="xl" mb={2} textAlign="center">
            Reset Password
          </Heading>
          <Text color="flickr.lightGray" opacity={0.7} textAlign="center">
            {isSubmitted 
              ? "Check your email for the reset code" 
              : "Enter your email to receive a password reset code"}
          </Text>
        </MotionFlex>

        <Box
          p={8}
          borderRadius="md"
          bg="rgba(34, 34, 34, 0.7)"
          border="1px solid"
          borderColor="rgba(243, 243, 243, 0.1)"
        >
          {!isSubmitted ? (
            <Stack spacing={6} as="form" onSubmit={handleSubmit}>
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  borderColor="gray.600"
                  _hover={{ borderColor: "flickr.pink" }}
                  _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="pink"
                bg="flickr.pink"
                size="lg"
                w="100%"
                isLoading={isLoading}
                loadingText="Sending..."
                _hover={{ bg: "#E5007A" }}
              >
                Send Reset Code
              </Button>
              
              <Flex justify="center" mt={2}>
                <Link 
                  as={RouterLink} 
                  to="/login" 
                  color="flickr.blue"
                  _hover={{ color: "flickr.pink" }}
                >
                  Back to Login
                </Link>
              </Flex>
            </Stack>
          ) : (
            <Stack spacing={4} align="center">
              <Text textAlign="center" mb={4}>
                We've sent a reset code to <strong>{email}</strong>. 
                The code will expire in 5 minutes.
              </Text>
              
              <Button
                colorScheme="blue"
                bg="flickr.blue"
                size="lg"
                w="100%"
                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                _hover={{ bg: "#0055C8" }}
              >
                Continue to Reset Password
              </Button>
              
              <Text fontSize="sm" color="gray.400" mt={4}>
                Didn't receive the email? Check your spam folder or try again.
              </Text>
            </Stack>
          )}
        </Box>
      </MotionBox>
    </Container>
  );
}

export default ForgotPassword;