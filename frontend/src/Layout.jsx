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

function App() {
  const location = useLocation();
  console.log("Current Path:", location.pathname);

  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate-password" element={<GeneratePassword/>}/>
          <Route element={<PublicRoute />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/my-passwords" element={<PasswordPage />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/temp" element={<TempPage />} /> {/* Deleting Later */}
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </ChakraProvider>
    </UserProvider>
  );
}

export default App;
