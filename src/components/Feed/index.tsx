import { useState, useEffect, memo } from 'react'
import {
  Grid,
  Box,
  Flex,
  Text,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import { MdOutlineVisibility, MdFavorite } from 'react-icons/md'
import { ref, onValue, off } from 'firebase/database'
import NextImage from 'next/image'

// components
import { Modal } from './Modal'
import { UserNotLoggedInModal } from './UserNotLoggedInModal'

// hooks
import { useShimmer } from '../../hooks/useShimmer'
import { useUser } from '../../hooks/contexts/useUser'
import { useHandleError } from '../../hooks/useHandleError'

// firebase services
import { db } from '../../services/firebase/client/database'

// types
import type { FirebaseError } from 'firebase/app'
import type { ImageInfo } from '../../typings/userInfo'

type CardProps = {
  imageInfo: ImageInfo
  isAboveTheFold: boolean
}

function Card({ imageInfo, isAboveTheFold }: CardProps) {
  // states
  const [imageMetrics, setImageMetrics] = useState({
    likes: 0,
    views: 0,
  })

  // hooks
  const { userInfo } = useUser()
  const shimmer = useShimmer(200, 200)
  const { handleError } = useHandleError()
  const { onOpen, onClose, isOpen, onToggle } = useDisclosure()
  const isWideScreen = useBreakpointValue({ sm: false, md: true, lg: true })

  // fetches the total of views and likes for the image
  useEffect(() => {
    const imageRef = ref(db, `image_metrics/${imageInfo.id}`)

    onValue(
      imageRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const metrics = snapshot.val()

          setImageMetrics({ likes: metrics.likes, views: metrics.views })
        }
      },
      (err) => {
        const error = err as FirebaseError

        handleError({ error })
      }
    )

    return () => off(imageRef)
  }, [isOpen])

  return (
    <>
      <Box
        as='li'
        position='relative'
        borderRadius='base'
        overflow='hidden'
        cursor='pointer'
        sx={{
          '&:hover > .post-info': {
            d: 'flex',
          },
          '&:nth-of-type(3n + 2)': {
            gridColumn: isWideScreen && '2 / 4',
            gridRow: isWideScreen && 'span 2',
          },
        }}
        tabIndex={0}
        transition='200ms'
        _focus={{
          boxShadow: '0 0 0 3px rgba(66, 153, 255, 0.6)',
          outline: '2px solid transparent',
        }}
        onClick={onOpen}
        onKeyDown={({ key }) => (key === 'Enter' ? onToggle() : undefined)} // this type error is probably related to chakra ui
      >
        <NextImage
          src={imageInfo.path}
          alt={imageInfo.description}
          width='200px'
          height='200px'
          layout='responsive'
          objectFit='cover'
          placeholder='blur'
          blurDataURL={shimmer}
          quality={isWideScreen ? 100 : 30}
          priority={isAboveTheFold}
        />

        <Flex
          align='center'
          justify='center'
          gridGap={3}
          d='none'
          h='100%'
          w='100%'
          bg='rgba(0, 0, 0, 0.4)'
          className='post-info'
          position='absolute'
          zIndex={2}
          top='0'
          transition='200ms'
        >
          <Flex align='center' gridGap={1}>
            <MdOutlineVisibility size={30} color='white' />

            <Text as='span' fontWeight='bold' color='light.100'>
              {imageMetrics.views}
            </Text>
          </Flex>

          <Flex align='center' gridGap={1}>
            <MdFavorite size={30} color='#fb1' />

            <Text as='span' fontWeight='bold' color='light.100'>
              {imageMetrics.likes}
            </Text>
          </Flex>
        </Flex>
      </Box>

      {userInfo.isLoggedIn ? (
        <Modal isOpen={isOpen} onClose={onClose} imageInfo={imageInfo} />
      ) : (
        <UserNotLoggedInModal isOpen={isOpen} onClose={onClose} />
      )}
    </>
  )
}

type Props = {
  images: ImageInfo[]
}

function FeedBase({ images }: Props) {
  return (
    <Grid
      mx='auto'
      maxW='768px'
      as='ul'
      gap={5}
      templateColumns={['1fr', 'repeat(3, 1fr)']}
    >
      {images.map((image, index) => (
        <Card key={image.id} imageInfo={image} isAboveTheFold={index < 4} />
      ))}
    </Grid>
  )
}

const Feed = memo(FeedBase, (prevProps, nextProps) =>
  Object.is(prevProps.images, nextProps.images)
)

export { Feed }
