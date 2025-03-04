import { Flex, Heading, Text } from "@chakra-ui/react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Button,
  Checkbox,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../context/UserContext";

function GeneratePassword() {
  const [passwordSize, setPasswordSize] = useState(15);
  const [password, setPassword] = useState("");
  const [specificString, setSpecificString] = useState("");
  const [excludeChars, setExcludeChars] = useState("");
  const [customChars, setCustomChars] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    symbols: true,
    numbers: true,
  });
  const { user, loading } = useUser();
  const toast = useToast();

  const handleOptionChange = (option) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
  };

  const generatePassword = () => {
    setExistingPassword("");
    let characters = "";

    if (options.uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) characters += "0123456789";
    if (options.symbols) characters += "!@#$%^&*()_+[]{}|;:,.<>?";

    if (customChars) characters += customChars;

    if (excludeChars) {
      const excludeSet = new Set(excludeChars);
      characters = characters
        .split("")
        .filter((char) => !excludeSet.has(char))
        .join("");
    }

    if (characters.length === 0) {
      toast({
        title: "Warning",
        description:
          "No character types selected. Using a minimal default set.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }

    if (specificString.length > passwordSize) {
      toast({
        title: "Error",
        description: "The specific string is longer than the password size.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const adjustedLength = passwordSize - specificString.length;
    let newPassword = "";

    for (let i = 0; i < adjustedLength; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const insertPosition = Math.floor(Math.random() * (newPassword.length + 1));
    newPassword =
      newPassword.slice(0, insertPosition) +
      specificString +
      newPassword.slice(insertPosition);

    setPassword(newPassword);
  };

  const shufflePassword = () => {
    if (!existingPassword.trim()) {
      toast({
        title: "No password to shuffle",
        description: "Please enter a password to shuffle",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    let passwordArray = existingPassword.split("");
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [
        passwordArray[j],
        passwordArray[i],
      ];
    }

    const shuffledPassword = passwordArray.join("");
    setPassword(shuffledPassword);
    setExistingPassword(shuffledPassword);
  };

  const handleCopy = async () => {
    if (!password) {
      toast({
        title: "No password to copy",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: error.message
          ? error.message
          : "Please try again or copy manually",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        height={"container.sm"}
      >
        <Spinner />
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"flex-start"}
      gap={16}
      color={"gray.200"}
      marginY={20}
    >
      {/* Left Container */}
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
              value={password || "Password123"}
              isDisabled
            />
            <Button
              backgroundColor={"gray.300"}
              onClick={handleCopy}
              fontSize="xs"
              width={"12"}
              color="black"
            >
              Copy
            </Button>
          </Flex>
          <Button
            backgroundColor={"gray.300"}
            fontWeight={"bold"}
            onClick={generatePassword}
            color="black"
          >
            Generate
          </Button>
          {user && <Text cursor={"pointer"}>Save Password?</Text>}
        </Flex>
      </Flex>

      {/* Right Container */}
      <Flex
        flexDirection={"column"}
        backgroundColor={"rgba(26, 32, 44, 0.7)"}
        paddingTop={9}
        paddingBottom={8}
        paddingX={"12"}
        rounded={"lg"}
        gap={6}
      >
        {/* Length of Password */}
        <Flex flexDirection={"column"} gap={2}>
          <Text>Set password length (5-40 characters)</Text>
          <NumberInput
            step={1}
            size={"sm"}
            focusBorderColor="gray.500"
            min={5}
            max={40}
            value={passwordSize}
            onChange={(valueString) =>
              setPasswordSize(parseInt(valueString) || 5)
            }
          >
            <NumberInputField
              textAlign={"center"}
              _active={{ border: "none" }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
        {user && (
          <>
            {/* Include Subsequent String Randomly or at a specific index */}
            <Flex flexDirection={"column"} gap={2}>
              <Text>Insert a specific string into the password</Text>
              <Input
                value={specificString}
                onChange={(e) => setSpecificString(e.target.value)}
                placeholder="Required string (e.g., Special2024)"
              />
            </Flex>
            {/* Exclude Characters */}
            <Flex flexDirection={"column"} gap={2}>
              <Text>Exclude certain characters (up to 30)</Text>
              <Input
                value={excludeChars}
                onChange={(e) => setExcludeChars(e.target.value)}
                maxLength={30}
                placeholder="Characters to exclude (e.g., 0O1Il)"
              />
            </Flex>
            {/* Add specific Characters randomly */}
            <Flex flexDirection={"column"} gap={2}>
              <Text>Include custom characters randomly</Text>
              <Input
                value={customChars}
                onChange={(e) => setCustomChars(e.target.value)}
                placeholder="Additional characters (e.g., £€¥)"
              />
            </Flex>
            {/* Shuffle existing password */}
            <Flex flexDirection={"column"} gap={2}>
              <Text>Shuffle an existing password</Text>
              <Flex gap={2}>
                <Input
                  flex="1"
                  value={existingPassword}
                  onChange={(e) => setExistingPassword(e.target.value)}
                  placeholder="Enter a password to shuffle"
                />
                <Button
                  size="md"
                  backgroundColor="gray.300"
                  color="black"
                  onClick={shufflePassword}
                >
                  Shuffle
                </Button>
              </Flex>
            </Flex>
          </>
        )}
        {/* Character set options */}
        <Flex flexDirection={"column"} gap={2}>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text>Uppercase letters (A-Z)</Text>
            <Checkbox
              isChecked={options.uppercase}
              onChange={() => handleOptionChange("uppercase")}
            />
          </Flex>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text>Lowercase letters (a-z)</Text>
            <Checkbox
              isChecked={options.lowercase}
              onChange={() => handleOptionChange("lowercase")}
            />
          </Flex>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text>Symbols (!@#$%^&*)</Text>
            <Checkbox
              isChecked={options.symbols}
              onChange={() => handleOptionChange("symbols")}
            />
          </Flex>
          <Flex
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text>Numbers (0-9)</Text>
            <Checkbox
              isChecked={options.numbers}
              onChange={() => handleOptionChange("numbers")}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default GeneratePassword;
