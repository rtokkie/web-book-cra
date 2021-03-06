import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  VStack,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import { FormEventHandler, useEffect, VFC } from 'react'
import { useForm } from 'react-hook-form'

import { BookData } from '@/model/book'

export type BookDetailFormModalProps = {
  book: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
  isOpen: boolean
  onClose: () => void
  onSaveBookDetail: (
    editedBookData: Pick<BookData, 'published' | 'authorNames' | 'releasedAt' | 'price'>
  ) => Promise<void>
}

export const BookDetailFormModal: VFC<BookDetailFormModalProps> = ({
  book,
  isOpen,
  onClose,
  onSaveBookDetail,
}) => {
  // ui
  const { register, handleSubmit: hookFormSubmit, reset } = useForm()

  useEffect(() => {
    const getDefaultValues = () => ({
      published: book.published,
      authorNames: book.authorNames.join(','),
      releasedAt: book.releasedAt ? format(book.releasedAt.toDate(), 'yyyy-MM-dd') : '',
      price: book.price,
    })
    reset(getDefaultValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, reset])

  // handler
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    hookFormSubmit(async ({ published, authorNames, releasedAt, price }) => {
      await onSaveBookDetail({
        published,
        authorNames: authorNames.split(',').filter(Boolean),
        releasedAt: releasedAt ? Timestamp.fromDate(new Date(releasedAt)) : null,
        price: Number(price),
      })
      onClose()
    })(e)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>本の設定</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing="4">
              <FormControl>
                <FormLabel fontSize="sm">未公開 / 公開</FormLabel>
                <Switch {...register('published')} size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">著者名</FormLabel>
                <Input {...register('authorNames')} placeholder="著者A, 著者B" autoComplete="off" />
                <FormHelperText>複数人の場合はカンマ区切りで入力してください。</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">発売日</FormLabel>
                <Input type="date" {...register('releasedAt')} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">価格（円）</FormLabel>
                <Input type="number" {...register('price')} autoComplete="off" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" size="sm" colorScheme="blue">
              保存
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
