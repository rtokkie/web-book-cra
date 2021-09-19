import 'github-markdown-css'

import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { getUnixTime } from 'date-fns'
import { head } from 'lodash-es'
import { every } from 'lodash-es'
import { ChangeEventHandler, useState, VFC } from 'react'
import { FaArrowLeft, FaRegImage } from 'react-icons/fa'
import { Link as ReactRouterLink, useParams } from 'react-router-dom'
import { useAsync, useAsyncFn, useMount } from 'react-use'

import { Book } from '@/domain/book'
import { Chapter } from '@/domain/chapter'
import { useMarked } from '@/hooks/useMarked'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'
import { ChapterService } from '@/service/chapter'
import { StorageService } from '@/service/storage'
import { AutoResizeTextarea } from '@/ui/basics/AutoResizeTextarea'
import { ImageUpload } from '@/ui/basics/ImageUpload'

type HeaderProps = {
  book: Book
  onSaveChapter: () => Promise<void>
}

const Header: VFC<HeaderProps> = ({ book, onSaveChapter }) => {
  return (
    <Box h="16" bg="white" borderBottom="1px" borderBottomColor="gray.200" boxShadow="sm">
      <Container maxW="container.lg" h="100%">
        <HStack h="100%" justifyContent="space-between">
          <HStack spacing="4">
            <Link
              as={ReactRouterLink}
              to={routeMap['/admin/books/:bookId/edit'].path({ bookId: book.id })}
            >
              <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
            </Link>
            <Text fontWeight="bold" fontSize="lg">
              {book.title}
            </Text>
          </HStack>

          <Button colorScheme="blue" onClick={onSaveChapter}>
            保存する
          </Button>
        </HStack>
      </Container>
    </Box>
  )
}

type MarkedContentProps = {
  content: string
}

const MarkedContent: VFC<MarkedContentProps> = ({ content }) => {
  const markedContent = useMarked(content)

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="md"
      boxSizing="border-box"
      minHeight="440px"
      width="720px"
      boxShadow="md"
    >
      <Box
        className="markdown-body"
        padding="8px 16px"
        dangerouslySetInnerHTML={{ __html: markedContent }}
      />
    </Box>
  )
}

type MarkedContentEditorProps = {
  value: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

const MarkedContentEditor: VFC<MarkedContentEditorProps> = ({ value, onChange }) => {
  return (
    <AutoResizeTextarea
      placeholder="Write in Markdown"
      _placeholder={{
        fontWeight: 'bold',
      }}
      bg="white"
      minH="440px"
      width="720px"
      value={value}
      onChange={onChange}
    />
  )
}

type ChapterEditorProps = {
  title: string
  setTitle: (title: string) => void
  content: string
  setContent: (content: string) => void
  handleUploadImage: ChangeEventHandler<HTMLInputElement>
}

const ChapterEditor: VFC<ChapterEditorProps> = ({
  title,
  setTitle,
  content,
  setContent,
  handleUploadImage,
}) => {
  const { isOpen: isPreviewing, onOpen: preview, onClose: edit } = useDisclosure()

  return (
    <HStack pb="8">
      <VStack spacing="8">
        {isPreviewing ? (
          <Text
            alignSelf="start"
            bg="white"
            fontSize="lg"
            fontWeight="bold"
            h="48px"
            w="720px"
            py="2"
            px="4"
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            display="flex"
            alignItems="center"
            boxShadow="md"
          >
            {title}
          </Text>
        ) : (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            size="lg"
            alignSelf="start"
            bg="white"
            width="720px"
            fontWeight="bold"
          />
        )}

        <HStack spacing="8">
          {isPreviewing ? (
            <MarkedContent content={content} />
          ) : (
            <MarkedContentEditor value={content} onChange={(e) => setContent(e.target.value)} />
          )}

          <VStack alignSelf="start" spacing="4">
            <Box>
              <Text textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500">
                Edit / Preview
              </Text>
              <Center mt="1">
                <Switch
                  size="lg"
                  isChecked={isPreviewing}
                  onChange={(e) => (e.target.checked ? preview() : edit())}
                />
              </Center>
            </Box>

            <Box>
              <Text textAlign="center" fontSize="sm" fontWeight="bold" color="gray.500">
                Upload Image
              </Text>
              <Center mt="1">
                <ImageUpload onUploadImage={handleUploadImage}>
                  <Button size="sm">
                    <Icon as={FaRegImage} h="6" w="6" color="gray.500" />
                  </Button>
                </ImageUpload>
              </Center>
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  )
}

type ChapterEditPageProps = {
  book: Book
  chapter: Chapter
}

const ChapterEditPage: VFC<ChapterEditPageProps> = ({ book, chapter }) => {
  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content)

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (e) => {}

  return (
    <VStack spacing="8" minHeight="100vh" bg="gray.50">
      <Box alignSelf="stretch">
        <Header book={book} onSaveChapter={() => Promise.resolve()} />
      </Box>

      <ChapterEditor {...{ title, setTitle, content, setContent, handleUploadImage }} />
    </VStack>
  )
}

const ChapterEditPageContainer: VFC = () => {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>()

  const [{ value: book }, fetchBook] = useAsyncFn(() => {
    return BookService.getDoc(bookId)
  })

  const [{ value: chapter }, fetchChapter] = useAsyncFn(() => {
    return ChapterService.getDoc(chapterId, { bookId })
  })

  useMount(() => {
    fetchBook()
    fetchChapter()
  })

  const uploadImage = async (file: File) => {}

  return (
    <>{every([book, chapter], Boolean) && <ChapterEditPage book={book!} chapter={chapter!} />}</>
  )
}

export default ChapterEditPageContainer
