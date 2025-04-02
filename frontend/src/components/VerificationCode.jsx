import React, { useState } from "react";
import {
  Container,
  Flex,
  Stack,
  Text,
  Heading,
  Input,
  HStack,
  Button,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function VerificationCode({ email }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const { verifyCode } = useUser();
  const toast = useToast();

  const handleChange = (index, value) => {
    const digit = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

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
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i];
    }
    setCode(newCode);
  };

  const handleSubmit = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Six digits must be entered.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await verifyCode(email, verificationCode);
      if (response.success) {
        toast({
          title: "Verification Successful",
          description: "Your account has been successfully registered.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
        return;
      }
      toast({
        title: "Verification Failed",
        description: response.error || "Invalid verification code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container
      boxShadow={"dark-sm"}
      backgroundColor={"rgba(26, 32, 44, 0.5)"}
      color={"gray.300"}
      padding={10}
      rounded={"lg"}
    >
      <Flex
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={6}
      >
        <Stack textAlign={"center"}>
          <Heading>Verification Code</Heading>
          <Text>
            A 6-digit verification code was emailed to {email}. The code expires
            in 5 minutes!
          </Text>
        </Stack>
        <HStack spacing={2} mt={4}>
          {code.map((digit, index) => (
            <Input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              maxWidth="70px"
              textAlign="center"
              focusBorderColor="flickr.pink"
              bg="rgba(34, 34, 34, 0.8)"
              borderColor="gray.600"
              _hover={{ borderColor: "flickr.pink" }}
            />
          ))}
        </HStack>
        <Button 
          width={"full"} 
          onClick={handleSubmit}
          bg="flickr.pink"
          color="white"
          _hover={{ bg: "#E5007A" }}
          transition="background-color 0.3s"
        >
          Verify
        </Button>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Didn't receive a code? Check your spam folder or contact support.
        </Text>
      </Flex>
    </Container>
  );
}

export default VerificationCode;