import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Container,
  Divider,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, LockIcon } from "@chakra-ui/icons";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, loading } = useUser();
  const location = useLocation();

  // Determine menu links based on user auth state
  const centerLinks = loading
    ? []
    : user
    ? ["Home", "Generate Password", "My Passwords"]
    : ["Home", "Generate Password"];

  // Function to generate URL paths from link names
  const generateHref = (linkName) => {
    if (linkName === "Home") return "/";
    return `/${linkName.toLowerCase().replace(/\s+/g, "-")}`;
  };

  // NavLink component for consistent styling
  const NavLink = ({ children }) => {
    const href = generateHref(children);
    const isActive = location.pathname === href;

    return (
      <Link
        as={RouterLink}
        to={href}
        px={3}
        py={2}
        rounded="md"
        fontWeight="medium"
        position="relative"
        color={isActive ? "white" : "flickr.lightGray"}
        _hover={{
          textDecoration: "none",
          color: "white",
        }}
        _after={{
          content: '""',
          position: "absolute",
          width: isActive ? "100%" : "0%",
          height: "1px",
          bottom: "0",
          left: "0",
          bg: "flickr.pink",
          transition: "all 0.7s ease-in-out",
        }}
        _hover={{
          _after: {
            width: "100%",
          },
        }}
        transition="all 0.3s"
      >
        {children}
      </Link>
    );
  };

  return (
    <Box as="nav" position="sticky" top="0" zIndex="1000" bg="#222222">
      <Container maxW="container.xl" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Link
            as={RouterLink}
            to="/"
            _hover={{
              textDecoration: "none",
            }}
            display="flex"
            alignItems="center"
          >
            <Flex
              align="center"
              color="white"
              fontWeight="bold"
              fontSize={20}
              gap={6}
            >
              <Box
                bg="flickr.blue"
                py={.5}
                px={4}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition={"background-color 0.5s ease-in-out"}
                _hover={{
                  backgroundColor: "flickr.pink",
                }}
                gap={3}
              >
                <LockIcon boxSize={4} />
                <Text letterSpacing="wide">Password Manager</Text>
              </Box>
            </Flex>
          </Link>

          {/* Center Nav Menu - Desktop */}
          <HStack
            as="nav"
            spacing={6}
            display={{ base: "none", md: "flex" }}
            ml={10}
          >
            {centerLinks.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>

          {/* Right section - Desktop */}
          <HStack spacing={4} display={{ base: "none", md: "flex" }}>
            {!loading &&
              (!user ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    fontSize="sm"
                    fontWeight={500}
                    variant="outline"
                    color="flickr.lightGray"
                    borderColor="flickr.lightGray"
                    borderWidth="1px"
                    _hover={{
                      borderColor: "flickr.pink",
                      color: "flickr.pink",
                    }}
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    fontSize="sm"
                    fontWeight={500}
                    bg="flickr.pink"
                    color="white"
                    borderWidth="0"
                    transition={"background-color 0.5s ease-in-out"}
                    _hover={{
                      bg: "flickr.blue",
                    }}
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/settings"
                    fontSize="sm"
                    variant="ghost"
                    color="flickr.lightGray"
                    _hover={{
                      color: "white",
                    }}
                    size="sm"
                  >
                    Settings
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/logout"
                    fontSize="sm"
                    variant="ghost"
                    color="flickr.lightGray"
                    _hover={{
                      color: "white",
                    }}
                    size="sm"
                  >
                    Logout
                  </Button>
                </>
              ))}
          </HStack>

          {/* Mobile menu button */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Navigation"
            display={{ md: "none" }}
            variant="ghost"
            color="white"
            _hover={{
              bg: "whiteAlpha.200",
            }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>

        {/* Mobile Nav Menu */}
        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={2} pt={2} pb={4}>
              {centerLinks.map((link) => (
                <Link
                  key={link}
                  as={RouterLink}
                  to={generateHref(link)}
                  px={3}
                  py={2}
                  rounded="md"
                  fontWeight="medium"
                  color="white"
                  _hover={{
                    bg: "whiteAlpha.200",
                  }}
                  onClick={onClose}
                >
                  {link}
                </Link>
              ))}
              <Divider borderColor="gray.700" my={2} />

              {!loading &&
                (!user ? (
                  <Flex gap={4} px={3}>
                    <Button
                      as={RouterLink}
                      to="/login"
                      width="50%"
                      fontSize="sm"
                      color="flickr.lightGray"
                      variant="outline"
                      onClick={onClose}
                    >
                      Login
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/signup"
                      width="50%"
                      fontSize="sm"
                      bg="flickr.pink"
                      onClick={onClose}
                    >
                      Sign Up
                    </Button>
                  </Flex>
                ) : (
                  <>
                    <Link
                      as={RouterLink}
                      to="/settings"
                      px={3}
                      py={2}
                      rounded="md"
                      color="flickr.lightGray"
                      onClick={onClose}
                    >
                      Settings
                    </Link>
                    <Link
                      as={RouterLink}
                      to="/logout"
                      px={3}
                      py={2}
                      rounded="md"
                      color="flickr.lightGray"
                      onClick={onClose}
                    >
                      Logout
                    </Link>
                  </>
                ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
