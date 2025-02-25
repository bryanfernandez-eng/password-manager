import {
  Container,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Logout() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await logout();
      if (response.success) {
        alert("Logout successful");
        navigate("/login");
        return;
      }
      alert("Something went wrong.");
      return;
    } catch (error) {
      alert("Error:", error.message);
    }
  };

  return (
    <Container color={"gray.300"} marginTop={20}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        bgColor={"gray.900"}
        padding={30}
        rounded={"lg"}
        flexDirection={"column"}
        gap={5}
      >
        <Heading>Logout</Heading>
        <Text>Are you sure you want to logout?</Text>

        <HStack>
          <Button bgColor={"gray.400"} onClick={handleSubmit}>
            Yes
          </Button>
          <Button bgColor={"gray.400"} onClick={() => navigate("/")}>
            No
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
}

export default Logout;
