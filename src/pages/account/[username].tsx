import { Flex, Text } from '@chakra-ui/react'
import Head from 'next/head'

// components
import { Toggle } from '../../components/Toggle'
import { DeleteAccount } from '../../components/pages/account/DeleteAccount'

// layout
import { UserHeader } from '../../components/layout/UserHeader'

function MyPhotos() {
  return (
    <Flex maxW='768px' mx='auto' direction='column' rowGap={5}>
      <Head>
        <title>Dogs | Minha conta</title>
      </Head>

      <Flex align='center' justify='space-between'>
        <Text>Mudar tema</Text>

        <Toggle />
      </Flex>

      <DeleteAccount />
    </Flex>
  )
}

MyPhotos.UserHeader = UserHeader

export default MyPhotos
