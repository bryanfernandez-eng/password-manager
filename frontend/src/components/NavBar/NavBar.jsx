import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Link as RouterLink } from "react-router-dom"; // Import React Router's Link

const Navbar = () => {
  const { isOpen,onOpen, onClose } = useDisclosure();
  const location = useLocation(); // Get the current location

  const centerLinks = ["Home", "Generate Password", "My Passwords"];
  const rightLinks = ["Settings", "Logout"];

  const NavLink = ({ children }) => {
    // Generate the href dynamically
    const generateHref = (linkName) => {
      if (linkName === "Home") return "/";
      return `/${linkName.toLowerCase().replace(/\s+/g, "-")}`;
    };

    const href = generateHref(children);
    const isActive = location.pathname === href; // Check if the current route matches the href

    return (
      <Link
        px={2}
        py={1}
        rounded={"md"}
        href={href}
        bg={isActive ? "whiteAlpha.700" : "transparent"} // Highlight active link
        color={isActive ? "blackAlpha.800" : "gray.300"} // Change text color for active link
        _hover={{
          textDecoration: "none",
          bg: "whiteAlpha.200",
          color: "whiteAlpha.700",
        }}
      >
        {children}
      </Link>
    );
  };

  return (
    <Box backgroundColor="blackAlpha.900" px={10}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Link
          href="/"
          _hover={{
            textDecoration: "none",
            backgroundColor: "whiteAlpha.400",
          }}
        >
          <Box
            color="whiteAlpha.900"
            fontWeight="bold"
            backgroundColor="whiteAlpha.300"
            py={1}
            px={2}
            rounded={"md"}
          >
            Password Manager
          </Box>
        </Link>
        <HStack
          as={"nav"}
          spacing={4}
          display={{ base: "none", md: "flex" }}
          color="whiteAlpha.900"
        >
          {centerLinks.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </HStack>

        <HStack
          as={"nav"}
          spacing={4}
          display={{ base: "none", md: "flex" }}
          color="whiteAlpha.900"
        >
          {rightLinks.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </HStack>

        {/* Mobile Menu Toggle */}
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Toggle Navigation"}
          display={{ md: "none" }}
          bg={"none"}
          color={"whiteAlpha.900"}
          _hover={{
            backgroundColor: "whiteAlpha.100",
          }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {/* Mobile Menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack color="whiteAlpha.900" as={"nav"} spacing={4}>
            {centerLinks.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
            <HStack color="whiteAlpha.900" as={"nav"} spacing={10}>
              {rightLinks.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
