import {
  Container,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  useToast,
  Toast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

function Logout() {
  const toast = useToast();
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await logout();
      if (response.success) {
        toast({
          title: "Logout Successful",
          description: "Goodbye!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }
      toast({
        title: "Logout Failed",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container color={"gray.300"} marginTop={50} height={"container.sm"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        padding={30}
        rounded={"lg"}
        flexDirection={"column"}
        gap={5}
        boxShadow={"dark-sm"}
        backgroundColor={"rgba(26, 32, 44, 0.5)"}
      >
        <Heading>Confirm Logout</Heading>
        <Text>Are you sure you want to log out of your account?</Text>

        <HStack gap={5}>
          <Button
            bgColor={"red.500"}
            _hover={{ bg: "red.600" }}
            onClick={handleSubmit}
          >
            <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
              <IoIosLogOut /> Logout{" "}
            </Flex>
          </Button>
          <Button bgColor={"gray.400"} onClick={() => navigate("/")}>
            <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
              {" "}
              <MdOutlineCancel /> Cancel
            </Flex>
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
}

export default Logout;
