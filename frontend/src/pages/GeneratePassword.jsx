import {  Flex, Heading, Text } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

function GeneratePassword() {
  const [passwordSize, setPasswordSize] = useState(15);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!";
    let newPassword = "";
    for (let i = 0; i < passwordSize; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setPassword(newPassword);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);

      alert("Copied");
    } catch (error) {
      alert("Failed to copy");
    }
  };

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"flex-start"}
      gap={16}
      color={"gray.200"}
      marginTop={20}
    >
      <Flex
        flexDirection={"column"}
        backgroundColor={"rgba(26, 32, 44, 0.7)"}
        alignItems={"center"}
        paddingTop={9}
        paddingBottom={8}
        paddingX={"12"}
        rounded={"lg"}
        gap={8}
        textAlign={"center"}
      >
        <Heading>Generate A Password</Heading>

        <Flex flexDirection={"column"} gap={3} width={"full"}>
          <Flex
            backgroundColor={"gray.700"}
            paddingLeft={3}
            rounded={"lg"}
            border={"2px"}
          >
            <Input
              width={"sm"}
              variant={"unstyled"}
              fontSize={"sm"}
              _disabled={{ color: "white", background: "transparent" }}
              value={password === "" ? "Password123" : password}
              isDisabled
            />
            <Button
              backgroundColor={"gray.300"}
              onClick={handleCopy}
              fontSize="xs"
              width={"12"}
            >
              Copy
            </Button>
          </Flex>
          <Button
            backgroundColor={"gray.300"}
            fontWeight={"bold"}
            onClick={generatePassword}
          >
            Generate
          </Button>
        </Flex>
      </Flex>

      <Flex
        flexDirection={"column"}
        backgroundColor={"rgba(26, 32, 44, 0.7)"}
        alignItems={"center"}
        paddingTop={9}
        paddingBottom={8}
        paddingX={"12"}
        rounded={"lg"}
        gap={8}
        textAlign={"center"}
      >
        <Text>Choose the length of the password! (5-40 characters)</Text>
        <NumberInput
          step={5}
          size={"sm"}
          focusBorderColor="gray.500"
          min={5}
          max={40}
          value={passwordSize}
          onChange={(value) => setPasswordSize(value)}
        >
          <NumberInputField textAlign={"center"} _active={{ border: "none" }} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </Flex>
  );
}

export default GeneratePassword;
