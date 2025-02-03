import{Box,Heading,Center,Button,FormControl,Input,Link, Stack} from "@chakra-ui/react"
import{ViewIcon,ViewOffIcon} from "@chakra-ui/icons"
import{useState} from "react"
function LoginPage() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
<Center h="100vh">
      <Box borderRightWidth={3} borderRightColor="blue.400"
      bg="gray.400" p={20} rounded="lg" padding={50} h="500">
      <Heading marginTop={6} fontSize={15} marginLeft={12}>Sign in to your account</Heading>
          <FormControl marginTop={6}>
         <p> Email</p>
          <Input borderTopColor="blue.400" borderTopWidth={3} 
          bg="white" type="Email" placeholder="Enter your email address">
          </Input>
         </FormControl>
          <FormControl marginTop={6}>
            <p marginLeft>Password</p>
             <Input borderTopColor="blue.400" borderTopWidth={3} 
             bg="white" type="password" placeholder="Enter your password">
             </Input>
         </FormControl>
         <Stack>
         <p>Forgot password?<Link color="blue.500"> Reset Password </Link></p>
          <Button marginTop={6} marginCenter={1} h="50px" w="340px" 
          bg="blue" color={"blackAlpha.800"} fontSize={39}>Log In</Button>
          <Button marginTop={6} marginCenter={1} h="50px" w="340px" 
          bg="white" color={"blackAlpha.800"} fontSize={30}>Create new account</Button>
         </Stack>
      </Box>
    </Center>
    </form>
  )
}

export default LoginPage
