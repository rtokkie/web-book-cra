import { Box, BoxProps, Center, Image, Text } from '@chakra-ui/react'
import { useMemo, VFC } from 'react'

export type BookImageProps = {
  imageUrl?: string
  size: 'sm' | 'md'
} & BoxProps

export const BookImage: VFC<BookImageProps> = ({ imageUrl, size, ...rest }) => {
  const style = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          boxW: '100px',
          boxH: '140px',
          textFontSize: 'md',
          textPb: '4',
        }
      case 'md':
        return {
          boxW: '200px',
          boxH: '280px',
          textFontSize: '2xl',
          textPb: '8',
        }
    }
  }, [size])

  return (
    <Box
      width={style.boxW}
      height={style.boxH}
      position="relative"
      borderRadius="md"
      boxShadow="md"
      bg="gray.100"
      {...rest}
    >
      <Center position="absolute" inset="0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            borderRadius="md"
            width={style.boxW}
            height={style.boxH}
            objectFit="cover"
          />
        ) : (
          <Text pb={style.textPb} fontSize={style.textFontSize} fontWeight="bold" color="gray.500">
            Web Book
          </Text>
        )}
      </Center>
    </Box>
  )
}
