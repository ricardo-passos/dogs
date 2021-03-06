import {
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  Text,
  Button,
  Box,
  Divider,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { signInWithEmailAndPassword } from 'firebase/auth'

// components
import { Input } from '../form/inputs/RegularInput'
import { PasswordInput } from '../form/inputs/PasswordInput'
import { PasswordRecovery } from '../pages/login/PasswordRecovery'
import { SignUpCallToAction } from '../pages/login/SignUpCallToAction'

// hooks
import { useHandleError } from '../../hooks/useHandleError'

// firebase
import { auth } from '../../services/firebase/client/auth'

// yup validation
import { loginValidation } from '../form/validations/login'

// types
import type { FirebaseError } from 'firebase/app'
import type { SubmitHandler } from 'react-hook-form'

type FormInputs = {
  email: string
  password: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

function UserNotLoggedInModal({ isOpen, onClose }: Props) {
  const { handleError } = useHandleError()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: yupResolver(loginValidation),
  })

  const onFormSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
    } catch (err) {
      const error = err as FirebaseError

      handleError({ error })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={3}>
          <Text as='strong' d='block' textAlign='center'>
            Faça login para continuar
          </Text>

          <Divider borderColor='#a8a8a8' my={2} />

          <Box as='form' onSubmit={handleSubmit(onFormSubmit)}>
            <Input
              label='E-mail'
              error={errors.email?.message}
              {...register('email')}
            />
            <PasswordInput
              label='Senha'
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              mt={3}
              isLoading={isSubmitting}
              loadingText='Entrando...'
              type='submit'
            >
              Entrar
            </Button>
          </Box>

          <PasswordRecovery />

          <SignUpCallToAction />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { UserNotLoggedInModal }
