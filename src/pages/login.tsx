import { parseCookies } from 'nookies'
import { captureException } from '@sentry/nextjs'
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react'
import { getAuth } from 'firebase-admin/auth'
import Head from 'next/head'

// components
import { Background } from '../components/form/Background'
import { LoginForm } from '../components/pages/login/Form'
import { SignUpCallToAction } from '../components/pages/login/SignUpCallToAction'

// firebase services
import { app } from '../services/firebase/server/app'

// types
import type { GetServerSideProps } from 'next'

const getServerSideProps: GetServerSideProps = async (context) => {
  const userIDToken = parseCookies(context)['@dogs:token']

  if (!userIDToken) return { props: {} }

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

function Login() {
  // hooks
  const isWideScreen = useBreakpointValue({ sm: false, md: true })

  return (
    <>
      <Head>
        <title>Dogs | Entrar</title>
      </Head>

      {isWideScreen ? (
        <Flex as='main' justify='center' columnGap={5} w='100%' mx='auto'>
          <Box flexBasis='50vw' position='relative'>
            <Background />
          </Box>

          <Box flexBasis='50vw' p={5} mt='130px'>
            <LoginForm />

            <SignUpCallToAction />
          </Box>
        </Flex>
      ) : (
        <Box p={5}>
          <LoginForm />

          <SignUpCallToAction />
        </Box>
      )}
    </>
  )
}

export { getServerSideProps }

export default Login
