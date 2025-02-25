import {
  Heading,
  Button,
  FormControl,
  Input,
  Stack,
  Flex,
  FormLabel,
  Container,
  Text,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!password || !email) {
      alert("All Fields Must Be Filled In.");
      return;
    }

    try {
      const response = await login(email, password);
      if (response.success) {
        alert("Successful Login");
        navigate("/");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error.message || "Error occured.");
    }
  };

  return (
    <Container marginTop={20} color={"gray.200"}>
      <Flex
        backgroundColor={"gray.900"}
        rounded="lg"
        padding={30}
        flexDirection={"column"}
        alignItems={"center"}
        gap={4}
      >
        <Heading
          fontSize={50}
          flex
          justifyContent={"center"}
          alignItems={"center"}
        >
          Login
        </Heading>
        <Stack gap="2" width={"full"}>
          <FormControl orientation="horizontal">
            <FormLabel>Email:</FormLabel>
            <Input
              focusBorderColor="gray.600"
              type="email"
              placeholder={"me@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl orientation="horizontal">
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              placeholder={"Password"}
              focusBorderColor="gray.600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Stack>
        <Stack width={"full"} gap={4}>
          <Button
            fontSize={20}
            padding={3}
            color={"gray.200"}
            bgColor={"gray.700"}
            _hover={{ backgroundColor: "gray.600" }}
            onClick={handleSubmit}
          >
            Log In
          </Button>

          <Flex flexDirection={"column"} gap={2}>
            <Text>
              Need an account?{" "}
              <Text display={"inline"} textDecor={"underline"}>
                <Link to={"/signup"}>Sign up</Link>
              </Text>
            </Text>
            <Text>
              Forgot password?{" "}
              <Text textDecor={"underline"} display={"inline"}>
                <Link>Reset Password</Link>
              </Text>
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Container>
  );
}

export default LoginPage;
