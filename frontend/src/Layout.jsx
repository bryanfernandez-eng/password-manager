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
      "html, body": {
        height: "100%",
        overflowY: "scroll",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
      },
      body: {
        bg: "black",
        backgroundImage:
          "radial-gradient(circle at 56% -46%, #1200991e 1%, transparent 97.05%),  radial-gradient(circle at 149% 125%, #1200993e 16%, transparent 41.05%), radial-gradient(circle at 50% 50%, #0800991b 9%, transparent 44.05%), radial-gradient(circle at -25% 137%, #08009926 18%, transparent 54.05%)",
        backgroundSize: "100% 100%",
        animation: "gradientShift 30s ease infinite",
        "&::before": {
          content: '""',
          backdropFilter: "blur(10px)",
          pointerEvents: "none",
        },
      },
      "@keyframes gradientShift": {
        "0%, 100%": { backgroundPosition: "0% 0%" },
        "25%": { backgroundPosition: "100% 0%" },
        "50%": { backgroundPosition: "100% 100%" },
        "75%": { backgroundPosition: "0% 100%" },
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
          <Route element={<PublicRoute />}>
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
