import{Box,Heading,Center,Button,FormControl,Input,Link, Stack} from "@chakra-ui/react"
import{ViewIcon,ViewOffIcon} from "@chakra-ui/icons"
import{useState} from "react"
import{useNavigate} from "react-router-dom"
function LoginPage() {
  const[email,setEmail]=useState("");
  const[password,setPassword]= useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful, redirect to dashboard
      navigate("/passwords");
    } else {
      // Show error message
      alert(data.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
<Center h="100vh">
      <Box bg="gray.900" p={20} rounded="lg" padding={50} h="500">
      <Heading marginTop={-10} fontSize={30} marginLeft={120} color={"white"}>Login</Heading>
          <FormControl marginTop={6} color="white">
         <h2 > Email</h2>
          <Input bg="black" type="Email" fontColor="White" placeholder="Enter your email address">
          </Input>
         </FormControl>
          <FormControl marginTop={6} color="white">
            <p>Password</p>
             <Input  bg="white"  type="Password" fontColor="white" placeholder="Enter your password">
             </Input>
         </FormControl>
         <Stack color={"white"}>
          <Button marginTop={6} marginCenter={1} h="50px" w="340px" 
          bg="black" color={"white"} fontSize={38}>Log In</Button>
          <p>Need an account?<Link color="blue"> Sign up </Link></p>
          <p>Forgot password?<Link color="blue"> Reset Password </Link></p>
         </Stack>
      </Box>
    </Center>
    </form>
  )
}

export default LoginPage
