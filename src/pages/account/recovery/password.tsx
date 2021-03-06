import { Box, Button, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import Head from 'next/head'

// components
import { Input } from '../../../components/form/inputs/RegularInput'
import { PasswordInput } from '../../../components/form/inputs/PasswordInput'

// hooks
import { useHandleError } from '../../../hooks/useHandleError'

// form validation
import { recoveryPasswordValidation } from '../../../components/form/validations/recoveryPassword'

// firebase services
import { auth } from '../../../services/firebase/client/auth'

// types
import type { GetServerSideProps } from 'next'
import type { FirebaseError } from 'firebase/app'
import type { SubmitHandler } from 'react-hook-form'

const getServerSideProps: GetServerSideProps = async (context) => {
  const oobCode = context.query['oobCode'] as string

  if (oobCode) {
    return {
      props: { oobCode },
    }
  }

  return {
    redirect: {
      destination: '/account/recovery',
      permanent: false,
    },
  }
}

type FormInputsProps = {
  password: string
  confirmPassword: string
}

type Props = {
  oobCode: string
}

function Password({ oobCode }: Props) {
  // hooks
  const toast = useToast()
  const router = useRouter()
  const { handleError } = useHandleError()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputsProps>({
    resolver: yupResolver(recoveryPasswordValidation),
  })

  const onFormSubmit: SubmitHandler<FormInputsProps> = async (data) => {
    try {
      await verifyPasswordResetCode(auth, oobCode)

      await confirmPasswordReset(auth, oobCode, data.password)

      reset()

      toast({
        title: 'Senha alterada com sucesso.',
        description: 'Faça login em sua conta com suas novas credenciais.',
        status: 'success',
        isClosable: true,
        duration: 5000,
        onCloseComplete: () => router.push('/login'),
      })
    } catch (err) {
      const error = err as FirebaseError

      handleError({ error })
    }
  }

  return (
    <Box as='main' p={5} maxW='768px' mx='auto'>
      <Head>
        <title>Dogs | Mudar senha</title>
      </Head>

      <Box as='form' onSubmit={handleSubmit(onFormSubmit)} w='100%'>
        <PasswordInput
          label='Nova senha'
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label='Confirmar senha'
          type='password'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          w='100%'
          mt={5}
          type='submit'
          isLoading={isSubmitting}
          loadingText='Alterando...'
        >
          Alterar
        </Button>
      </Box>
    </Box>
  )
}

export { getServerSideProps }

export default Password
