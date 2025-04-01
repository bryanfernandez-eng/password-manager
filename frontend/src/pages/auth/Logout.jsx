import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  HStack,
  useToast,
  Icon,
  useBreakpointValue
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { ExternalLinkIcon, CloseIcon } from "@chakra-ui/icons";
import { IoLogOutOutline } from "react-icons/io5";

// Animated components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function Logout() {
  const toast = useToast();
  const { logout } = useUser();
  const navigate = useNavigate();
  
  // Responsive adjustments
  const padding = useBreakpointValue({ base: 6, md: 8 });
  const iconSize = useBreakpointValue({ base: 10, md: 14 });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  const handleLogout = async () => {
    try {
      const response = await logout();
      
      if (response.success) {
        toast({
          title: "Logged Out Successfully",
          description: "See you again soon!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        navigate("/login");
      } else {
        toast({
          title: "Logout Failed",
          description: response.error || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Container centerContent pt={{ base: 14, md: 20 }} color="flickr.lightGray">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        maxWidth="450px"
        width="90%"
      >
        <MotionFlex
          direction="column"
          align="center"
          p={padding}
          borderRadius="md"
          bg="rgba(34, 34, 34, 0.8)"
          border="1px solid"
          borderColor="rgba(243, 243, 243, 0.1)"
          as={motion.div}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Box 
            as={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            mb={4}
          >
            <Icon as={IoLogOutOutline} boxSize={iconSize} color="flickr.pink" />
          </Box>
          
          <Heading 
            size="lg" 
            mb={4} 
            textAlign="center"
            as={motion.h2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Sign Out?
          </Heading>
          
          <Text 
            textAlign="center" 
            mb={8}
            opacity={0.8}
            as={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Are you sure you want to log out of your account?
            Your vault will be securely locked.
          </Text>
          
          <HStack 
            spacing={{ base: 3, md: 5 }} 
            width="full"
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              leftIcon={<CloseIcon />}
              onClick={handleCancel}
              variant="outline"
              size={buttonSize}
              flex={1}
              borderColor="rgba(243, 243, 243, 0.2)"
              _hover={{ bg: "rgba(243, 243, 243, 0.05)" }}
              as={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </Button>
            
            <Button
              rightIcon={<ExternalLinkIcon />}
              onClick={handleLogout}
              bg="flickr.pink"
              color="white"
              _hover={{ bg: "#E00077" }}
              _active={{ bg: "#D00070" }}
              size={buttonSize}
              flex={1}
              as={motion.button}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign Out
            </Button>
          </HStack>
        </MotionFlex>
        
        <Box 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          mt={5} 
          textAlign="center"
        >
          <Text fontSize="xs" color="flickr.lightGray" opacity={0.6}>
            Your data will remain securely encrypted
          </Text>
        </Box>
      </MotionBox>
    </Container>
  );
}

export default Logout;