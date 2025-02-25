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
import VerificationCode from "../components/VerificationCode";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showVerificationCode, setShowVerificationCode] = useState(false);

  const { signup } = useUser();

  const handleSubmit = async () => {
    if (!password || !email || !confirmPassword || !firstName || !lastName) {
      alert("All Fields Must Be Filled In.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords Must Match");
      return;
    }
    try {
      const name = firstName + " " + lastName;
      const response = await signup(name, email, password);
      if (response.success) {
        alert("Successful Login");
        setShowVerificationCode(true);
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error.message || "Error occured.");
    }
  };

  return (
    <Container marginTop={50} color={"gray.200"} height={'container.sm'}>
      {showVerificationCode ? (
        <VerificationCode email={email} />
      ) : (
        <Flex
          rounded="lg"
          padding={30}
          flexDirection={"column"}
          alignItems={"center"}
          gap={4}
          boxShadow={"dark-sm"}
          backgroundColor={"rgba(26, 32, 44, 0.5)"}
        >
          <Heading
            fontSize={50}
            flex
            justifyContent={"center"}
            alignItems={"center"}
          >
            Signup
          </Heading>
          <Stack gap="2" width={"full"}>
            <FormControl orientation="horizontal">
              <FormLabel>First Name:</FormLabel>
              <Input
                focusBorderColor="gray.600"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl orientation="horizontal">
              <FormLabel>Last Name:</FormLabel>
              <Input
                focusBorderColor="gray.600"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
            <FormControl orientation="horizontal">
              <FormLabel>Email:</FormLabel>
              <Input
                focusBorderColor="gray.600"
                type="email"
                placeholder="me@email.com"
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
            <FormControl orientation="horizontal">
              <FormLabel>Confirm Password:</FormLabel>
              <Input
                type="password"
                placeholder={"Confirm Password"}
                focusBorderColor="gray.600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Register
            </Button>

            <Flex flexDirection={"column"} gap={2}>
              <Text>
                Have an account?{" "}
                <Text display={"inline"} textDecor={"underline"}>
                  <Link to={"/login"}>Login</Link>
                </Text>
              </Text>
            </Flex>
          </Stack>
        </Flex>
      )}
    </Container>
  );
}

export default SignupPage;
