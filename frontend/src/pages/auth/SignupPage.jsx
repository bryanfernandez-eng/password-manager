// src/pages/auth/SignupPage.jsx
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import VerificationCode from "../../components/VerificationCode";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";

// Wrapper component with animation
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  
  const { signup } = useUser();
  const toast = useToast();
  const navigate = useNavigate();
  
  // Responsive adjustments
  const padding = useBreakpointValue({ base: 6, md: 8 });
  const width = useBreakpointValue({ base: "90%", sm: "450px" });

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "All fields must be filled in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "Passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const name = `${firstName} ${lastName}`;
      const response = await signup(name, email, password);
      
      if (response.success) {
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setShowVerificationCode(true);
      } else {
        toast({
          title: "Signup Failed",
          description: response.error || "An error occurred. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerificationCode) {
    return (
      <Container centerContent pt={{ base: 10, md: 16 }} color="flickr.lightGray">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          width={width}
          p={padding}
          borderRadius="md"
          bg="rgba(34, 34, 34, 0.7)"
          border="1px solid"
          borderColor="rgba(243, 243, 243, 0.1)"
        >
          <VerificationCode email={email} />
        </MotionBox>
      </Container>
    );
  }

  return (
    <Container centerContent pt={{ base: 6, md: 10 }} mb={10} color="flickr.lightGray">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        width={width}
        maxWidth="500px"
      >
        <MotionFlex 
          direction="column"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          align="center" 
          mb={6}
        >
          <Box 
            as={motion.div}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            mb={3}
          >
            <LockIcon boxSize={12} color="flickr.pink" />
          </Box>
          <Heading size="xl" mb={2}>Create Account</Heading>
          <Text color="flickr.lightGray" opacity={0.7} fontSize="sm" textAlign="center">
            Set up your secure password vault
          </Text>
        </MotionFlex>

        <Box
          p={padding}
          borderRadius="md"
          bg="rgba(34, 34, 34, 0.7)"
          border="1px solid"
          borderColor="rgba(243, 243, 243, 0.1)"
          backdropFilter="blur(10px)"
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Stack spacing={4} mb={5}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">First Name</FormLabel>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  _placeholder={{ color: "whiteAlpha.400" }}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontSize="sm">Last Name</FormLabel>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  _placeholder={{ color: "whiteAlpha.400" }}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                _placeholder={{ color: "whiteAlpha.400" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  _placeholder={{ color: "whiteAlpha.400" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    color="whiteAlpha.700"
                    _hover={{ color: "flickr.pink" }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {password && (
              <Box 
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                mb={-2}
              >
                <PasswordStrengthMeter 
                  password={password} 
                  showCriteria={true} 
                />
              </Box>
            )}

            <FormControl isRequired>
              <FormLabel fontSize="sm">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  _placeholder={{ color: "whiteAlpha.400" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    color="whiteAlpha.700"
                    _hover={{ color: "flickr.pink" }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>

          <Button
            as={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            w="full"
            bg="flickr.pink"
            color="white"
            _hover={{ bg: "#E00077" }}
            _active={{ bg: "#D00070" }}
            size="md"
            h="45px"
            fontSize="md"
            mb={4}
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Create Account
          </Button>

          <Flex justifyContent="center" fontSize="sm" mt={2}>
            <Text color="whiteAlpha.700">Already have an account?</Text>
            <Text 
              as={Link} 
              to="/login" 
              color="flickr.blue" 
              ml={1}
              _hover={{ color: "flickr.pink", textDecoration: "none" }}
            >
              Sign in
            </Text>
          </Flex>
        </Box>

        <Box 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          mt={5} 
          textAlign="center"
        >
          <Text fontSize="xs" color="flickr.lightGray" opacity={0.6}>
            Your passwords will be encrypted and stored securely
          </Text>
        </Box>
      </MotionBox>
    </Container>
  );
}

export default SignupPage;