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
  useToast,
  VStack,
  HStack,
  useDisclosure, 
  Box,
  InputGroup,
  InputRightElement,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Divider,
  Icon,
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import PasswordEntryModal from "../components/PasswordEntryModal";
import passwordService from "../api/passwordService";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { CopyIcon, CheckIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaSave, FaRandom } from "react-icons/fa";

// Generate Password Component
function GeneratePassword() {
  const [passwordSize, setPasswordSize] = useState(19);
  const [password, setPassword] = useState("");
  const [specificString, setSpecificString] = useState("");
  const [excludeChars, setExcludeChars] = useState("");
  const [customChars, setCustomChars] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
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
    setCopied(false);
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
    setCopied(false);
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
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      // Reset copied status after 2 seconds
      setTimeout(() => setCopied(false), 2000);
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
      <Flex 
        maxW="container.xl" 
        mx="auto" 
        gap={8} 
        p={6} 
        color="flickr.lightGray"
        mt={8}
      >
        {/* Left Container */}
        <VStack
          flex="1"
          spacing={6}
          backgroundColor="rgba(34, 34, 34, 0.9)"
          padding={8}
          borderRadius="xl"
          align="stretch"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.2)"
          border="1px solid"
          borderColor="gray.700"
        >
          <Heading textAlign="center" size="xl" color="white" mb={4}>
            Generate Password
          </Heading>

          <Box position="relative" mb={4}>
            <InputGroup size="lg" mb={4}>
              <Input
                pr="4.5rem"
                fontFamily="monospace"
                fontSize="xl"
                value={password || ""}
                placeholder="Your secure password will appear here"
                isReadOnly
                height="60px"
                bg="gray.800"
                borderColor="gray.600"
                type={showPassword ? "text" : "password"}
                _hover={{ borderColor: "flickr.pink" }}
                textAlign="center"
              />
              <InputRightElement width="4.5rem" height="60px">
                <Tooltip label={showPassword ? "Hide password" : "Show password"}>
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "flickr.pink" }}
                    mr={1}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </Tooltip>
              </InputRightElement>
            </InputGroup>

            <Flex justify="space-between" mb={6} gap={4}>
              <Button
                width="full"
                backgroundColor="flickr.pink"
                color="white"
                size="lg"
                height="54px"
                fontSize="lg"
                _hover={{ backgroundColor: "#E5007A", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                onClick={generatePassword}
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
              >
                Generate
              </Button>
              
              <Button
                backgroundColor="flickr.blue"
                color="white"
                size="lg"
                height="54px"
                px={6}
                _hover={{ backgroundColor: "#0055C8", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
                onClick={handleCopy}
                leftIcon={copied ? <CheckIcon /> : <CopyIcon />}
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Flex>
            
            {user && password && (
              <Button
                leftIcon={<FaSave />}
                variant="outline"
                width="full"
                borderColor="gray.600"
                color="flickr.lightGray"
                _hover={{ borderColor: "flickr.pink", color: "flickr.pink" }}
                onClick={handleSavePassword}
                mb={4}
              >
                Save This Password
              </Button>
            )}
          </Box>
          
          {/* Password Strength Meter */}
          {password && (
            <Box bg="gray.800" p={4} borderRadius="md" borderColor="gray.700" borderWidth="1px">
              <PasswordStrengthMeter password={password} showCriteria={false} />
            </Box>
          )}
          
          {/* Character Set Options */}
          <Box mt={4}>
            <Text fontWeight="medium" mb={3} fontSize="lg" color="white">Character Types</Text>
            <HStack spacing={2} mb={6} wrap="wrap" justify="space-between">
              {[
                { label: "A-Z", key: "uppercase", color: "blue.400" },
                { label: "a-z", key: "lowercase", color: "green.400" },
                { label: "0-9", key: "numbers", color: "orange.400" },
                { label: "#@$", key: "symbols", color: "purple.400" },
              ].map(({ label, key, color }) => (
                <Button
                  key={key}
                  size="md"
                  flexGrow={1}
                  variant={options[key] ? "solid" : "outline"}
                  bg={options[key] ? color : "transparent"}
                  color={options[key] ? "white" : color}
                  borderColor={color}
                  onClick={() => handleOptionChange(key)}
                  _hover={{ opacity: 0.8 }}
                >
                  {label}
                </Button>
              ))}
            </HStack>
            
            <Flex direction="column" mb={4}>
              <Text mb={2}>Password Length: {passwordSize} characters</Text>
              <Flex align="center" gap={4}>
                <Slider
                  flex="1"
                  min={5}
                  max={40}
                  step={1}
                  value={passwordSize}
                  onChange={(val) => setPasswordSize(val)}
                  colorScheme="pink"
                >
                  <SliderTrack bg="gray.700">
                    <SliderFilledTrack bg="flickr.pink" />
                  </SliderTrack>
                  <SliderThumb boxSize={5} />
                </Slider>
                <NumberInput
                  maxW="80px"
                  min={5}
                  max={40}
                  value={passwordSize}
                  onChange={(valueString) => setPasswordSize(parseInt(valueString) || 5)}
                >
                  <NumberInputField textAlign="center" borderColor="gray.600" />
                  <NumberInputStepper>
                    <NumberIncrementStepper borderColor="gray.600" />
                    <NumberDecrementStepper borderColor="gray.600" />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </Flex>
          </Box>
        </VStack>
        
        {/* Right Container */}
        <VStack
          flex="1"
          spacing={6}
          backgroundColor="rgba(34, 34, 34, 0.9)"
          padding={8}
          borderRadius="xl"
          align="stretch"
          boxShadow="0 10px 25px rgba(0, 0, 0, 0.2)"
          border="1px solid"
          borderColor="gray.700"
        >
          <Heading size="md" color="flickr.lightGray" mb={2}>
            Advanced Options
            {!user && <Badge ml={2} colorScheme="pink">Login Required</Badge>}
          </Heading>
          
          <Divider borderColor="gray.700" mb={2} />
          
          {user ? (
            <>
              <VStack spacing={4} align="stretch">
                {/* Specific String */}
                <Box>
                  <Text fontWeight="medium" mb={1}>Insert a specific string</Text>
                  <Input
                    value={specificString}
                    onChange={(e) => setSpecificString(e.target.value)}
                    placeholder="E.g., Special2024!"
                    borderColor="gray.600"
                    _hover={{ borderColor: "flickr.pink" }}
                    _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
                    bg="gray.800"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    This string will be included in your password
                  </Text>
                </Box>

                {/* Exclude Characters */}
                <Box>
                  <Text fontWeight="medium" mb={1}>Exclude characters</Text>
                  <Input
                    value={excludeChars}
                    onChange={(e) => setExcludeChars(e.target.value)}
                    maxLength={30}
                    placeholder="E.g., 0O1Il"
                    borderColor="gray.600"
                    _hover={{ borderColor: "flickr.pink" }}
                    _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
                    bg="gray.800"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    These characters will be excluded from the generation
                  </Text>
                </Box>

                {/* Custom Characters */}
                <Box>
                  <Text fontWeight="medium" mb={1}>Include custom characters</Text>
                  <Input
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                    placeholder="E.g., £€¥"
                    borderColor="gray.600"
                    _hover={{ borderColor: "flickr.pink" }}
                    _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
                    bg="gray.800"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Additional characters to include in generation
                  </Text>
                </Box>

                {/* Shuffle Existing Password */}
                <Box>
                  <Text fontWeight="medium" mb={1}>Shuffle existing password</Text>
                  <Flex gap={2}>
                    <Input
                      flex={1}
                      value={existingPassword}
                      onChange={(e) => setExistingPassword(e.target.value)}
                      placeholder="Paste a password to shuffle"
                      borderColor="gray.600"
                      _hover={{ borderColor: "flickr.pink" }}
                      _focus={{ borderColor: "flickr.pink", boxShadow: "0 0 0 1px #FF0084" }}
                      bg="gray.800"
                    />
                    <Button 
                      backgroundColor="flickr.blue"
                      color="white"
                      _hover={{ backgroundColor: "#0055C8" }}
                      onClick={shufflePassword}
                      leftIcon={<Icon as={FaRandom} />}
                    >
                      Shuffle
                    </Button>
                  </Flex>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Randomize the order of characters in an existing password
                  </Text>
                </Box>
              </VStack>
            </>
          ) : (
            <Flex 
              direction="column" 
              justify="center" 
              align="center" 
              height="100%" 
              p={10}
              textAlign="center"
              bg="gray.800"
              borderRadius="md"
              opacity={0.7}
            >
              <Text mb={4}>Sign in to access advanced password generation features:</Text>
              <VStack spacing={2} align="stretch" opacity={0.6}>
                <HStack>
                  <Box w="24px" textAlign="center">•</Box>
                  <Text>Include specific strings in your password</Text>
                </HStack>
                <HStack>
                  <Box w="24px" textAlign="center">•</Box>
                  <Text>Exclude problematic characters</Text>
                </HStack>
                <HStack>
                  <Box w="24px" textAlign="center">•</Box>
                  <Text>Add custom symbols for increased security</Text>
                </HStack>
                <HStack>
                  <Box w="24px" textAlign="center">•</Box>
                  <Text>Shuffle existing passwords</Text>
                </HStack>
                <HStack>
                  <Box w="24px" textAlign="center">•</Box>
                  <Text>Save passwords to your secure vault</Text>
                </HStack>
              </VStack>
            </Flex>
          )}
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