import VerificationCode from '../components/VerificationCode'
import { Flex } from '@chakra-ui/react'

function TempPage() {
  return (
    <Flex justifyContent={"center"} alignItems={"center"} marginTop={50}>
      <VerificationCode/>
    </Flex>
  )
}

export default TempPage
