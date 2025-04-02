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
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const toast = useToast();
  const navigate = useNavigate();

  // Responsive adjustments
  const padding = useBreakpointValue({ base: 6, md: 8 });
  const width = useBreakpointValue({ base: "90%", sm: "400px" });

  const handleSubmit = async () => {
    if (!password || !email) {
      toast({
        title: "Login Failed",
        description: "All fields must be filled in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: response.error || "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Container centerContent pt={{ base: 10, md: 16 }} maxW="container.md">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        width={width}
        maxWidth="450px"
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
          <Heading size="xl" mb={2}>
            Sign In
          </Heading>
          <Text
            color="flickr.lightGray"
            opacity={0.7}
            fontSize="sm"
            textAlign="center"
          >
            Enter your credentials to access your vault
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
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                _placeholder={{ color: "whiteAlpha.400" }}
                size="md"
                onKeyDown={handleKeyDown}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  _placeholder={{ color: "whiteAlpha.400" }}
                  size="md"
                  onKeyDown={handleKeyDown}
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
            variant="primary"
            size="md"
            mb={4}
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Signing in..."
            h="45px"
            fontSize="md"
          >
            Sign In
          </Button>

          <Flex
            justifyContent="space-between"
            alignItems="center"
            fontSize="sm"
            mt={3}
          >
            <Text
              as={Link}
              to="/forgot-password"
              color="flickr.lightGray"
              _hover={{ color: "flickr.pink" }}
              opacity={0.8}
              fontSize="sm"
            >
              Forgot password?
            </Text>
            <Text
              as={Link}
              to="/signup"
              color="flickr.blue"
              _hover={{ color: "flickr.pink" }}
              fontSize="sm"
            >
              Create account
            </Text>
          </Flex>
        </Box>

        <Box
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          mt={8}
          textAlign="center"
        >
          <Text fontSize="xs" color="flickr.lightGray" opacity={0.6}>
            Secure password storage for your digital life
          </Text>
        </Box>
      </MotionBox>
    </Container>
  );
}

export default LoginPage;
