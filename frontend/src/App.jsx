import { Form, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import PasswordPage from "./pages/PasswordPage/PasswordPage";
import NavBar from "./components/NavBar/NavBar";
import HomNav from "./components/NavBar/HomNav";
import HomeNavB from "./components/NavBar/HomNavB";
import SignupPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { ChakraProvider } from "@chakra-ui/react";
import{Box} from "@chakra-ui/react";

function App() {
  const location = useLocation(); // Get current route
  console.log("Current Path:", location.pathname); // Debugging: check current path

  // Only hide navbar on /login page
  const shouldHideNavbar = location.pathname === "/login";
  console.log("Should hide navbar:", shouldHideNavbar);


  return (
    <ChakraProvider>
      <Box minH="100vh" display ="flex" flexDirection ="column">
      {location.pathname==="/" && <HomNav/>}
      {location.pathname==="/passwords"&&<NavBar/>}
      <Box flex="1">
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/passwords" element={<PasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </Box>
        <Box as="footer" mt="auto">
        {location.pathname==="/"&&<HomeNavB/>}
      </Box>
        </Box>
      
    </ChakraProvider>
  );
}

export default App;
