import { Box, HStack, Icon, IconButton, Link, Tag, Text, VStack } from '@chakra-ui/react'
import { format } from 'date-fns'
import { VFC } from 'react'
import { BiRightArrow } from 'react-icons/bi'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { Link as ReactRouterLink, useHistory } from 'react-router-dom'

import { Book } from '@/model/book'
import { routeMap } from '@/routes'

import { BookImage } from '../Shared/BookImage'

export type BookItemProps = {
  book: Book
  onDeleteBook: (book: Book) => Promise<void>
}

export const BookItem: VFC<BookItemProps> = ({ book, onDeleteBook }) => {
  // app
  const history = useHistory()

  // handler
  const handleClickShow = () => {
    history.push(routeMap['/admin/books/:bookId/viewer'].path({ bookId: book.id }))
  }

  const handleClickEdit = () => {
    history.push(routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id }))
  }

  const handleClickDelete = async () => {
    await onDeleteBook(book)
  }

  return (
    <Box>
      <HStack justifyContent="space-between">
        <HStack spacing="4">
          <BookImage imageUrl={book.image?.url} size="sm" />

          <VStack alignSelf="start" alignItems="start" spacing="1">
            <Link
              as={ReactRouterLink}
              to={routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id })}
              fontWeight="bold"
            >
              {book.title}
            </Link>
            {book.published ? (
              <Tag size="sm" colorScheme="blue" fontWeight="bold" fontSize="xs" color="blue.900">
                公開中
              </Tag>
            ) : (
              <Tag size="sm" fontWeight="bold" fontSize="xs" color="gray.500">
                未公開
              </Tag>
            )}
            <Box pl="2">
              <Text fontSize="xs" color="gray.500">
                著者: {book.authorNames.join(', ')}
              </Text>
              <Text fontSize="xs" color="gray.500">
                発売日: {book.releasedAt ? format(book.releasedAt.toDate(), 'yyyy-MM-dd') : ''}
              </Text>
              <Text fontSize="xs" color="gray.500">
                価格: {book.price} 円
              </Text>
            </Box>
          </VStack>
        </HStack>

        <HStack alignSelf="start">
          <IconButton
            aria-label="edit book"
            size="sm"
            isRound
            icon={<Icon as={BiRightArrow} h="4" w="4" color="gray.500" />}
            onClick={handleClickShow}
          />
          <IconButton
            aria-label="edit book"
            size="sm"
            isRound
            icon={<Icon as={HiOutlinePencil} h="4" w="4" color="gray.500" />}
            onClick={handleClickEdit}
          />
          <IconButton
            aria-label="delete book"
            size="sm"
            isRound
            icon={<Icon as={HiOutlineTrash} h="4" w="4" color="gray.500" />}
            onClick={handleClickDelete}
          />
        </HStack>
      </HStack>
    </Box>
  )
}
