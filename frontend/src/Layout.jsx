import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PasswordPage from "./pages/PasswordVault";
import NavBar from "./components/NavBar";
import SignupPage from "./pages/auth/Signup";
import LoginPage from "./pages/auth/Login";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/UserContext";
import TempPage from "./pages/TempPage";
import NotFoundPage from "./pages/NotFound";
import Logout from "./pages/auth/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { theme } from "./theme/theme";
import GeneratePassword from "./pages/GeneratePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChatbotWidget from "./components/ChatBot/ChatBotWidget";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";

function App() {
  const location = useLocation();
  console.log("Current Path:", location.pathname);

  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <Flex direction={"column"} minHeight={"100vh"}>
          <NavBar />
          {/* <ChatbotWidget /> */}
          <Box flex={1}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generate-password" element={<GeneratePassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<PublicRoute />}>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/my-passwords" element={<PasswordPage />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/temp" element={<TempPage />} />{" "}
              {/* Deleting Later */}
              <Route path="/*" element={<NotFoundPage />} />
            </Routes>
          </Box>

          <Footer />
        </Flex>
      </ChakraProvider>
    </UserProvider>
  );
}

export default App;
