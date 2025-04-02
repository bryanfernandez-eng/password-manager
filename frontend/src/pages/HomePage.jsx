import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  Flex,
  VStack,
  HStack,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { LockIcon, StarIcon, AddIcon } from "@chakra-ui/icons";
import { FaShieldAlt, FaKey, FaRandom, FaRobot } from "react-icons/fa";

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function HomePage() {
  const { user, loading, checkAuth } = useUser();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  if (loading) {
    return (
      <Flex justify="center" align="center" height="70vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.700"
          color="flickr.pink"
          size="xl"
        />
      </Flex>
    );
  }

  const features = [
    {
      icon: FaShieldAlt,
      title: "Secure Storage",
      description:
        "All your passwords are encrypted with industry-standard AES-256-CBC encryption",
    },
    {
      icon: FaKey,
      title: "Password Vault",
      description: "Organize, search, and access your passwords from anywhere",
    },
    {
      icon: FaRandom,
      title: "Password Generator",
      description: "Create strong, unique passwords with customizable options",
    },
    {
      icon: FaRobot,
      title: "AI Assistant",
      description:
        "Get help with password-related questions from our smart chatbot",
    },
  ];

  return (
    <Container maxW="container.xl" pt={{ base: 6, md: 12 }} px={4}>
      {/* Hero Section */}
      <MotionFlex
        direction="column"
        align="center"
        textAlign="center"
        mb={16}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LockIcon boxSize={16} color="flickr.pink" mb={6} />

        <Heading size="2xl" mb={4} lineHeight="shorter">
          {user?.name
            ? `Welcome ${user.name}!`
            : user
            ? "Welcome!"
            : "Secure Password Management"}
        </Heading>

        <Text
          fontSize="xl"
          color="flickr.lightGray"
          opacity={0.8}
          maxW="800px"
          mb={8}
        >
          {user
            ? "Your digital vault is ready. Manage your passwords securely and easily."
            : "Keep all your passwords organized, encrypted, and accessible in one secure location."}
        </Text>

        <HStack spacing={4}>
          <Button
            as={RouterLink}
            to={user ? "/my-passwords" : "/signup"}
            size="lg"
            bg="flickr.pink"
            color="white"
            px={8}
            _hover={{ bg: "#E00077" }}
            leftIcon={user ? <LockIcon /> : <StarIcon />}
          >
            {user ? "View My Vault" : "Get Started - It's Free"}
          </Button>

          {user && (
            <Button
              as={RouterLink}
              to="/generate-password"
              size="lg"
              variant="outline"
              borderColor="flickr.blue"
              color="flickr.blue"
              px={8}
              _hover={{ bg: "rgba(0, 99, 220, 0.1)" }}
              leftIcon={<AddIcon />}
            >
              Generate Password
            </Button>
          )}
        </HStack>
      </MotionFlex>

      {/* Features Section */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={8}
        mb={16}
        as={motion.div}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {features.map((feature, index) => (
          <MotionBox
            key={index}
            p={6}
            borderRadius="lg"
            bg="rgba(34, 34, 34, 0.7)"
            border="1px solid"
            borderColor="rgba(243, 243, 243, 0.1)"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{
              y: -5,
              borderColor: "rgba(255, 0, 132, 0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            <VStack align="center" spacing={4}>
              <Flex
                w={16}
                h={16}
                align="center"
                justify="center"
                color="white"
                rounded="full"
                bg="flickr.blue"
                mb={1}
              >
                <Icon as={feature.icon} boxSize={8} />
              </Flex>
              <Heading size="md">{feature.title}</Heading>
              <Text textAlign="center" color="flickr.lightGray" opacity={0.7}>
                {feature.description}
              </Text>
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* CTA Section */}
      {!user && (
        <MotionBox
          p={{ base: 8, md: 12 }}
          borderRadius="xl"
          bg="rgba(0, 99, 220, 0.1)"
          border="1px solid"
          borderColor="rgba(0, 99, 220, 0.3)"
          textAlign="center"
          maxW="900px"
          mx="auto"
          mb={16}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Heading size="lg" mb={4}>
            Ready to secure your digital life?
          </Heading>
          <Text
            fontSize="lg"
            color="flickr.lightGray"
            opacity={0.8}
            mb={6}
            maxW="600px"
            mx="auto"
          >
            Join thousands of users who trust our password manager to keep their
            credentials safe.
          </Text>
          <HStack spacing={4} justify="center">
            <Button
              as={RouterLink}
              to="/signup"
              size="lg"
              bg="flickr.pink"
              color="white"
              _hover={{ bg: "#E00077" }}
              px={8}
            >
              Create Free Account
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              variant="outline"
              borderColor="flickr.lightGray"
              color="flickr.lightGray"
              _hover={{ bg: "whiteAlpha.100" }}
            >
              Sign In
            </Button>
          </HStack>
        </MotionBox>
      )}
    </Container>
  );
}

export default HomePage;
