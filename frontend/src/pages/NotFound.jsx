import { Container, Flex, Heading} from "@chakra-ui/react";

function NotFoundPage() {
  return (
    <Container color={"red.500"}>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        height={"container.md"}
      >
        <Heading>Oops...404...Page Not Found</Heading>
      </Flex>
    </Container>
  );
}

export default NotFoundPage;
