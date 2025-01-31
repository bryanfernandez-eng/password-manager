import{Box,Heading,Center,Button,Flex,FormControl,FormLabel,Input,Text,Link} from "@chakra-ui/react"
import{ViewIcon,ViewOffIcon} from "@chakra-ui/icons"
import{useState} from "react"
function LoginPage() {
  return (
    <Center h="100vh" bg="gray.100">
      <Box bg="white" p="6" rounded="md" shadow="md" w= "sm">
        <form onSubmit={handleSubmit}>
        <FormControl>
        <Heading marginLeft={120}>Login</Heading>
        <p marginLeft> Username</p>
          <Input type="Username" placeholder="Enter your Username">
          </Input>
        </FormControl>
        <FormControl>
        <p marginLeft>password</p>
          <Input type="password" placeholder="Enter your password">
          </Input>
        </FormControl>
        <p>Forgot password?<Link color="Blue"> Reset Password </Link></p>
        <Button marginCenter={1} h="25px" w="340px">Login</Button>
        <Button h="25px" w="340px"> Create An Account</Button>
        </form>
      </Box>
    </Center>
    
  )
}

export default LoginPage
