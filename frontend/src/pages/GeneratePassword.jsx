import {
  Flex,
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Tag,
  Icon,
  Divider,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  CopyIcon,
  CheckIcon,
  ViewIcon,
  ViewOffIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { FaKey, FaCog, FaRandom } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import PasswordEntryModal from "../components/PasswordEntryModal";
import passwordService from "../api/passwordService";
import { useUser } from "../context/UserContext";

const MotionBox = motion(Box);

function GeneratePassword() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [customOptions, setCustomOptions] = useState({
    excludeChars: "",
    specificString: "",
    customChars: "",
  });

  const toast = useToast();
  const { user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPassword, setCurrentPassword] = useState(null);

  const [existingPassword, setExistingPassword] = useState("");

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

  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleOption = (option) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const generatePassword = () => {
    let charset = "";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Add custom characters
    if (customOptions.customChars) {
      charset += customOptions.customChars;
    }

    // Remove excluded characters
    if (customOptions.excludeChars) {
      const excludeSet = new Set(customOptions.excludeChars);
      charset = charset
        .split("")
        .filter((char) => !excludeSet.has(char))
        .join("");
    }

    if (charset.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        status: "error",
        duration: 2000,
      });
      return;
    }

    let generatedPassword = "";
    const specificStringLength = customOptions.specificString.length;
    const remainingLength = passwordLength - specificStringLength;

    // Generate random characters
    for (let i = 0; i < remainingLength; i++) {
      generatedPassword += charset.charAt(
        Math.floor(Math.random() * charset.length)
      );
    }

    // Insert specific string at random position
    const insertPosition = Math.floor(
      Math.random() * (generatedPassword.length + 1)
    );
    generatedPassword =
      generatedPassword.slice(0, insertPosition) +
      customOptions.specificString +
      generatedPassword.slice(insertPosition);

    setPassword(generatedPassword);
    setCopied(false);
  };

  const copyPassword = async () => {
    if (!password) {
      toast({
        title: "No Password",
        description: "Generate a password first",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Password copied to clipboard",
        status: "success",
        duration: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy password",
        status: "error",
        duration: 2000,
      });
    }
  };

  const handleSavePassword = () => {
    if (!password) {
      toast({
        title: "No Password",
        description: "Generate a password first",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    setCurrentPassword({
      siteName: "",
      siteUrl: "",
      email: "",
      password: password,
    });

    onOpen();
  };

  const handleModalSave = async () => {
    try {
      const response = await passwordService.addPassword(currentPassword);

      if (response.success) {
        toast({
          title: "Password Saved",
          description: "Successfully added to your vault",
          status: "success",
          duration: 2000,
        });
        onClose();
      } else {
        toast({
          title: "Save Failed",
          description: response.message || "Unable to save password",
          status: "error",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save password",
        status: "error",
        duration: 2000,
      });
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxW="container.xl"
      mx="auto"
      p={6}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        alignItems="stretch"
      >
        {/* Password Generation Section */}
        <VStack
          flex={1}
          spacing={6}
          bg="rgba(34, 34, 34, 0.9)"
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <Box width="full" textAlign="center">
            <HStack justify="center" spacing={3} mb={4}>
              <Icon as={FaKey} color="flickr.pink" boxSize={8} />
              <Text fontSize="2xl" fontWeight="bold">
                Generate Password
              </Text>
            </HStack>

            <InputGroup size="lg" mb={4}>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Your secure password will appear here"
                readOnly
                fontFamily="monospace"
                textAlign="center"
                bg="gray.800"
                color="flickr.lightGray"
                height="60px"
                fontSize="xl"
                borderColor="gray.600"
                _focus={{
                  borderColor: "flickr.pink",
                  boxShadow: "0 0 0 1px #FF0084",
                }}
              />
              <InputRightElement height="60px" pr={2}>
                <Tooltip
                  label={showPassword ? "Hide password" : "Show password"}
                >
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    color="flickr.lightGray"
                    _hover={{ color: "flickr.pink" }}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </Tooltip>
              </InputRightElement>
            </InputGroup>

            {/* Action Buttons */}
            <HStack width="full" spacing={4}>
              <Button
                flex={1}
                leftIcon={<RepeatIcon />}
                onClick={generatePassword}
                bg="flickr.blue"
                color="white"
                _hover={{ bg: "blue.600" }}
              >
                Generate
              </Button>
              <Button
                flex={1}
                leftIcon={copied ? <CheckIcon /> : <CopyIcon />}
                onClick={copyPassword}
                bg="flickr.pink"
                color="white"
                _hover={{ bg: "pink.600" }}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </HStack>

            {/* Password Strength */}
            {password && (
              <Box mt={4}>
                <PasswordStrengthMeter password={password} />
              </Box>
            )}

            {user && password && (
              <Button
                mt={4}
                width="full"
                leftIcon={<Icon as={FaKey} />}
                onClick={handleSavePassword}
                variant="outline"
                borderColor="flickr.blue"
                color="flickr.blue"
                _hover={{
                  bg: "rgba(0, 99, 220, 0.1)",
                  borderColor: "flickr.pink",
                }}
              >
                Save to Vault
              </Button>
            )}
          </Box>
        </VStack>

        {/* Advanced Options Section */}
        <VStack
          flex={1}
          spacing={6}
          bg="rgba(34, 34, 34, 0.9)"
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <HStack width="full" justify="space-between" mb={4}>
            <HStack spacing={3}>
              <Icon as={FaCog} color="flickr.pink" boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">
                Advanced Options
              </Text>
            </HStack>
         
          </HStack>

          <VStack width="full" spacing={6}>
            {/* Length Slider */}
            <Box width="full">
              <Text mb={2}>Password Length: {passwordLength}</Text>
              <Slider
                value={passwordLength}
                onChange={setPasswordLength}
                min={8}
                max={32}
                colorScheme="pink"
              >
                <SliderTrack bg="gray.700">
                  <SliderFilledTrack bg="flickr.pink" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>

            <Divider borderColor="gray.700" />

            {/* Character Type Toggles */}
            <Box width="full">
              <Text mb={3} fontWeight="medium">
                Character Types
              </Text>
              <HStack spacing={3}>
                {Object.keys(options).map((option) => (
                  <Button
                    key={option}
                    size="sm"
                    variant={options[option] ? "solid" : "outline"}
                    colorScheme={options[option] ? "pink" : "gray"}
                    onClick={() => toggleOption(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Button>
                ))}
              </HStack>
            </Box>

            <Divider borderColor="gray.700" />

            {/* Advanced Customization (Disabled for non-users) */}
            {user ? (
              <VStack width="full" spacing={4}>
                <Box width="full">
                  <Text mb={2}>Exclude Characters</Text>
                  <Input
                    value={customOptions.excludeChars}
                    onChange={(e) =>
                      setCustomOptions((prev) => ({
                        ...prev,
                        excludeChars: e.target.value,
                      }))
                    }
                    placeholder="E.g., 0O1Il"
                    bg="gray.800"
                    borderColor="gray.600"
                  />
                </Box>
                <Box width="full">
                  <Text mb={2}>Include Specific String</Text>
                  <Input
                    value={customOptions.specificString}
                    onChange={(e) =>
                      setCustomOptions((prev) => ({
                        ...prev,
                        specificString: e.target.value,
                      }))
                    }
                    placeholder="E.g., Special2024!"
                    bg="gray.800"
                    borderColor="gray.600"
                  />
                </Box>
                <Box width="full">
                  <Text mb={2}>Custom Characters</Text>
                  <Input
                    value={customOptions.customChars}
                    onChange={(e) =>
                      setCustomOptions((prev) => ({
                        ...prev,
                        customChars: e.target.value,
                      }))
                    }
                    placeholder="E.g., £€¥"
                    bg="gray.800"
                    borderColor="gray.600"
                  />
                </Box>
                {/* Shuffle Existing Password */}
                <Box width="full">
                  <Text mb={2}>Shuffle Existing Password</Text>
                  <Flex gap={2}>
                    <Input
                      flex={1}
                      value={existingPassword}
                      onChange={(e) => setExistingPassword(e.target.value)}
                      placeholder="Paste a password to shuffle"
                      bg="gray.800"
                      borderColor="gray.600"
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
            ) : (
              <Flex
                width="full"
                bg="gray.800"
                p={4}
                borderRadius="md"
                direction="column"
                align="center"
                opacity={0.7}
              >
                <Text textAlign="center" mb={3}>
                  Advanced customization is available for logged-in users
                </Text>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  colorScheme="pink"
                >
                  Login to Unlock
                </Button>
              </Flex>
            )}
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
    </MotionBox>
  );
}

export default GeneratePassword;
