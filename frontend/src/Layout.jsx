import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PasswordPage from "./pages/PasswordPage";
import NavBar from "./components/NavBar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { UserProvider } from "./context/UserContext";
import TempPage from "./pages/TempPage";
import NotFoundPage from "./pages/NotFoundPage";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black",
      },
    },
  },
});

function App() {
  const location = useLocation();
  console.log("Current Path:", location.pathname);

  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<PublicRoute/>}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/passwords" element={<PasswordPage />} />
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
