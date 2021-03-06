import { parseCookies } from 'nookies'
import { getAuth } from 'firebase-admin/auth'
import { captureException } from '@sentry/nextjs'
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react'
import Head from 'next/head'

// components
import { Background } from '../components/form/Background'
import { SignUpForm } from '../components/pages/signup/Form'

// firebase services
import { app } from '../services/firebase/server/app'

// types
import type { GetServerSideProps } from 'next'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userIDToken = parseCookies(context)['@dogs:token']

  if (!userIDToken)
    return {
      props: {},
    }

  try {
    const auth = getAuth(app)

    await auth.verifyIdToken(userIDToken)

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } catch (err) {
    process.env.NODE_ENV === 'production'
      ? captureException(err)
      : console.log({ err })

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
      <Head>
        <title>Dogs | Cadastrar</title>
      </Head>

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
