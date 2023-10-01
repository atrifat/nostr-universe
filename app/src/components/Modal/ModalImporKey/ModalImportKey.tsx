import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { ModalImportKeyContent } from './ModalImportKeyContent'

export const ModalImportKey = () => {
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.KEY_IMPORT)

  return (
    <Modal title="Add read-only keys" open={isOpen} handleClose={handleClose}>
      {isOpen && <ModalImportKeyContent handleCloseModal={handleClose} />}
    </Modal>
  )
}
