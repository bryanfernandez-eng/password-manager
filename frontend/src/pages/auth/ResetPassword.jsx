import React, { useState, useEffect } from "react";
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
  HStack,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, Link as RouterLink, useSearchParams } from "react-router-dom";
import { ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import backend from "../../api/db";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";

// Animated components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [resetCode, setResetCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = verify code, 2 = set new password
  
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please go back to the forgot password page",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/forgot-password");
    }
  }, [email, navigate, toast]);

  const handleCodeChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newCode = [...resetCode];
    newCode[index] = digit;
    setResetCode(newCode);

    if (digit !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    const newCode = [...resetCode];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i];
    }
    setResetCode(newCode);
  };

  const verifyCode = async () => {
    const code = resetCode.join("");
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit code from your email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.post("/auth/verify-reset-code", {
        email,
        resetCode: code,
      });

      if (response.data.success) {
        toast({
          title: "Code Verified",
          description: "You can now set a new password",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setStep(2);
      } else {
        toast({
          title: "Verification Failed",
          description: response.data.message || "Invalid or expired code",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to verify code",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordHandler = async () => {


    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password Is Empty",
        description: "Password must be at least 1 character long",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backend.post("/auth/reset-password", {
        email,
        resetCode: resetCode.join(""),
        newPassword: password,
      });

      if (response.data.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been updated. You can now log in with your new password.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      } else {
        toast({
          title: "Reset Failed",
          description: response.data.message || "Unable to reset password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container centerContent pt={{ base: 12, md: 16 }} color="flickr.lightGray">
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
          <Box 
            as={motion.div}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            mb={3}
          >
            <LockIcon boxSize={12} color="flickr.pink" />
          </Box>
          <Heading size="xl" mb={2} textAlign="center">
            {step === 1 ? "Verify Reset Code" : "Set New Password"}
          </Heading>
          <Text color="flickr.lightGray" opacity={0.7} textAlign="center">
            {step === 1 
              ? "Enter the 6-digit code sent to your email" 
              : "Create a new password for your account"}
          </Text>
        </MotionFlex>

        <Box
          p={8}
          borderRadius="md"
          bg="rgba(34, 34, 34, 0.7)"
          border="1px solid"
          borderColor="rgba(243, 243, 243, 0.1)"
        >
          {step === 1 ? (
            <Stack spacing={6}>
              <Text textAlign="center" fontSize="sm">
                Reset code sent to: <strong>{email}</strong>
              </Text>
              
              <HStack spacing={2} justify="center" mt={4}>
                {resetCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    maxWidth="50px"
                    textAlign="center"
                    focusBorderColor="flickr.pink"
                    borderColor="gray.600"
                    _hover={{ borderColor: "flickr.pink" }}
                    bg="rgba(34, 34, 34, 0.8)"
                  />
                ))}
              </HStack>
              
              <Button
                colorScheme="pink"
                bg="flickr.pink"
                size="lg"
                isLoading={isLoading}
                loadingText="Verifying..."
                onClick={verifyCode}
                _hover={{ bg: "#E5007A" }}
              >
                Verify Code
              </Button>
              
              <Flex mt={4} justify="center" fontSize="sm">
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  color="flickr.blue"
                  _hover={{ color: "flickr.pink" }}
                >
                  Resend Code
                </Link>
              </Flex>
            </Stack>
          ) : (
            <Stack spacing={4}>
              <FormControl id="new-password" isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    borderColor="gray.600"
                    _hover={{ borderColor: "flickr.pink" }}
                    _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
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
                <Box mb={2}>
                  <PasswordStrengthMeter password={password} />
                </Box>
              )}
              
              <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    borderColor="gray.600"
                    _hover={{ borderColor: "flickr.pink" }}
                    _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
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
              
              <Button
                colorScheme="pink"
                bg="flickr.pink"
                size="lg"
                mt={2}
                isLoading={isLoading}
                loadingText="Resetting..."
                onClick={resetPasswordHandler}
                _hover={{ bg: "#E5007A" }}
              >
                Reset Password
              </Button>
            </Stack>
          )}
        </Box>
      </MotionBox>
    </Container>
  );
}

export default ResetPassword;