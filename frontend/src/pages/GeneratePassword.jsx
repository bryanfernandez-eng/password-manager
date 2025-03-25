import {
  Flex,
  Heading,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Button,
  Checkbox,
  useToast,
  VStack,
  HStack,
  useDisclosure, 
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import PasswordEntryModal from "../components/PasswordEntryModal";
import passwordService from "../api/passwordService";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

// Generate Password Component
function GeneratePassword() {
  const [passwordSize, setPasswordSize] = useState(19);
  const [password, setPassword] = useState("");
  const [specificString, setSpecificString] = useState("");
  const [excludeChars, setExcludeChars] = useState("");
  const [customChars, setCustomChars] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: false,
    symbols: true,
    numbers: true,
  });
  const { user } = useUser();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPassword, setCurrentPassword] = useState(null);

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

  const handleSavePassword = () => {
    if (!password) {
      toast({
        title: "No Password to Save",
        description: "Please generate a password first",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Preset the password in the modal
    setCurrentPassword({
      siteName: "",
      siteUrl: "",
      email: "",
      password: password,
    });

    // Open the modal
    onOpen();
  };
  const handleModalSave = async () => {
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "No password data to save",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      // Create a new password entry
      const response = await passwordService.addPassword(currentPassword);

      if (response.success) {
        toast({
          title: "Password Saved",
          description: "Your password has been saved successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        // Close the modal
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Flex maxW="container.xl" mx="auto" gap={8} p={10} color="gray.200">
        {/* Left Container*/}
        <VStack
          flex="1"
          spacing={6}
          backgroundColor="rgba(26, 32, 44, 0.7)"
          padding={20}
          borderRadius="lg"
          align="stretch"
        >
          <Heading textAlign="center" size="xl">
            Generate Password
          </Heading>

          <VStack spacing={6} width="full">
            <Flex
              backgroundColor="gray.700"
              borderRadius="lg"
              overflow="hidden"
              width={"full"}
            >
              <Input
                flex={1}
                variant="unstyled"
                fontSize="lg"
                height="50px"
                paddingX={3}
                value={password || ""}
                isReadOnly
                placeholder="Generated password will appear here"
                textAlign="center"
              />
              <Button
                backgroundColor="gray.300"
                color="black"
                onClick={handleCopy}
                borderRadius={0}
                px={6}
                height={"full"}
              >
                Copy
              </Button>
            </Flex>
            <Button
              width="full"
              backgroundColor="gray.300"
              color="black"
              size="lg"
              onClick={generatePassword}
            >
              Generate
            </Button>
            {user && (
              <Text
                textAlign="center"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={handleSavePassword}
              >
                Save Password?
              </Text>
            )}
          </VStack>
          {/* Password Strength Meter at the bottom */}
          {password && (
            
            <Box width="md" marginTop={5}>
              <PasswordStrengthMeter password={password} showCriteria={false} />
            </Box>
          )}
        </VStack>
        {/* Right Container */}
        <VStack
          flex="1"
          spacing={6}
          backgroundColor="rgba(26, 32, 44, 0.7)"
          padding={8}
          borderRadius="lg"
          align="stretch"
        >
          {/* Password Length */}
          <VStack spacing={2} align="stretch">
            <Text>Password Length (5-40 characters)</Text>
            <NumberInput
              value={passwordSize}
              onChange={(valueString) =>
                setPasswordSize(parseInt(valueString) || 5)
              }
              min={5}
              max={40}
            >
              <NumberInputField textAlign="center" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </VStack>

          {user && (
            <>
              {/* Specific String */}
              <VStack spacing={2} align="stretch">
                <Text>Insert a specific string</Text>
                <Input
                  value={specificString}
                  onChange={(e) => setSpecificString(e.target.value)}
                  placeholder="Required string (e.g., Special2024)"
                />
              </VStack>

              {/* Exclude Characters */}
              <VStack spacing={2} align="stretch">
                <Text>Exclude characters (up to 30)</Text>
                <Input
                  value={excludeChars}
                  onChange={(e) => setExcludeChars(e.target.value)}
                  maxLength={30}
                  placeholder="Characters to exclude (e.g., 0O1Il)"
                />
              </VStack>

              {/* Custom Characters */}
              <VStack spacing={2} align="stretch">
                <Text>Include custom characters</Text>
                <Input
                  value={customChars}
                  onChange={(e) => setCustomChars(e.target.value)}
                  placeholder="Additional characters (e.g., £€¥)"
                />
              </VStack>

              {/* Shuffle Existing Password */}
              <VStack spacing={2} align="stretch">
                <Text>Shuffle existing password</Text>
                <HStack>
                  <Input
                    flex={1}
                    value={existingPassword}
                    onChange={(e) => setExistingPassword(e.target.value)}
                    placeholder="Enter a password to shuffle"
                  />
                  <Button colorScheme="gray" onClick={shufflePassword}>
                    Shuffle
                  </Button>
                </HStack>
              </VStack>
            </>
          )}

          {/* Character Set Options */}
          <VStack spacing={4} align="stretch">
            <VStack spacing={3} align="stretch">
              {[
                { label: "Uppercase letters (A-Z)", key: "uppercase" },
                { label: "Lowercase letters (a-z)", key: "lowercase" },
                { label: "Symbols (!@#$%^&*)", key: "symbols" },
                { label: "Numbers (0-9)", key: "numbers" },
              ].map(({ label, key }) => (
                <Flex
                  key={key}
                  justifyContent="space-between"
                  alignItems="center"
                  gap={3}
                  borderBottom={"1px"}
                  borderColor="gray.600"
                  pb={2}
                >
                  <Text>{label}</Text>
                  <Checkbox
                    isChecked={options[key]}
                    onChange={() => handleOptionChange(key)}
                    colorScheme="gray"
                  />
                </Flex>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Flex>

      {/* Password Entry Modal */}
      <PasswordEntryModal
        isOpen={isOpen}
        onClose={onClose}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        onSave={handleModalSave}
      />
    </>
  );
}

export default GeneratePassword;
