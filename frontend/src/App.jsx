import { Form, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import PasswordPage from "./pages/PasswordPage/PasswordPage";
import NavBar from "./components/NavBar/NavBar";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { ChakraProvider } from "@chakra-ui/react";
import{Box,extendTheme,CSSReset} from "@chakra-ui/react";
const theme= extendTheme({
  styles:{
    global:{
      body:{
        bg:"black"
      }
    }
  }
})
function App() {
  const location = useLocation(); // Get current route
  console.log("Current Path:", location.pathname); // Debugging: check current path

  return (
    <ChakraProvider theme={theme}>
      <NavBar/>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/passwords" element={<PasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
    </ChakraProvider>
  );
}

export default App;
