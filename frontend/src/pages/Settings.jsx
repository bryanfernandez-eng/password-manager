import React from "react";
import { Container,Box, Button,Heading } from "@chakra-ui/react";


function Settings(){
    return(
        <>
            <Container>
                <Box textAlign={"center"} backgroundColor={"white"} textColor={"black"} rounded={"3xl"}>
                    <Heading size={"lg"} color={"black"}>Account</Heading>
                    <p>view your details on demand</p>
                    <Button variant={"outline"}>Personal details</Button>
                </Box>
                <Box textAlign={"center"} marginTop={10} backgroundColor={"white"} textColor={"black"} rounded={"3xl"}>
                <Heading size={"lg"} color={"black"}>Privacy</Heading>

                   <h1>
                   Take control of you life 
                   </h1>
                   <Button onClick={"white"}  variant={"outline"}>Change password</Button>
                  <div >
                  <Button marginTop={2} variant={"outline"}>Delete account</Button>
                    </div>
                </Box>
            </Container>
        </>
    );
}
export default Settings