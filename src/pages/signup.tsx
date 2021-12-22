import { Flex, Box, useBreakpointValue } from '@chakra-ui/react'
import { parseCookies } from 'nookies'
import { getAuth } from 'firebase-admin/auth'

// components
import { Background } from '../components/pages/signup/Form
import { SignUpForm } from '../components/pages/signup/signupForm'

// firebase services
import { adminApp } from '../services/firebase/admin'

// types
import type { GetServerSideProps } from 'next'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userIDToken = parseCookies(context)['@dogs:token']

  if (!userIDToken)
    return {
      props: {},
    }

  try {
    const auth = getAuth(adminApp)

    await auth.verifyIdToken(userIDToken)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } catch (err) {
    console.log({ err })

    return {
      props: {},
    }
  }
}

function SignUp() {
  // hooks
  const isWideScreen = useBreakpointValue({ sm: false, md: true })

  return (
    <>
      {isWideScreen ? (
        <Flex as='main' justify='center' columnGap={5} w='100%' mx='auto'>
          <Box flexBasis='50%' position='relative'>
            <Background />
          </Box>

          <Box flexBasis='50%' p={5} mt='130px'>
            <SignUpForm />
          </Box>
        </Flex>
      ) : (
        <Box p={5}>
          <SignUpForm />
        </Box>
      )}
    </>
  )
}

export { getServerSideProps }

export default SignUp
