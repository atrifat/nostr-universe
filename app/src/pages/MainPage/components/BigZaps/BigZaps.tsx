import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { nip19 } from '@nostrband/nostr-tools'
import { fetchFollowedZaps, nostrbandRelay } from '@/modules/nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { ZapEvent } from '@/types/zap-event'
import { setBigZaps } from '@/store/reducers/contentWorkspace'
import { MIN_ZAP_AMOUNT } from '@/consts'
import { memo, useCallback } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonBigZaps } from '@/components/Skeleton/SkeletonBigZaps/SkeletonBigZaps'
import { ItemBigZap } from '@/components/ItemsContent/ItemBigZap/ItemBigZap'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { RootState } from '@/store/store'

export const BigZaps = memo(function BigZaps() {
  const { handleOpenContextMenu } = useOpenModalSearchParams()
  const { bigZaps, contactList } = useAppSelector((state: RootState) => state.contentWorkSpace)
  const dispatch = useAppDispatch()

  const handleOpenBigZap = useCallback(
    (bigZap: ZapEvent) => {
      let addr = ''
      if (bigZap.targetEvent) {
        if (bigZap.targetEvent.kind === 0) {
          addr = nip19.nprofileEncode({
            pubkey: bigZap.targetEvent.pubkey,
            relays: [nostrbandRelay]
          })
        } else if (
          (bigZap.targetEvent.kind >= 10000 && bigZap.targetEvent.kind < 20000) ||
          (bigZap.targetEvent.kind >= 30000 && bigZap.targetEvent.kind < 40000)
        ) {
          addr = nip19.naddrEncode({
            pubkey: bigZap.targetEvent.pubkey,
            kind: bigZap.targetEvent.kind,
            identifier: bigZap.targetEvent.identifier,
            relays: [nostrbandRelay]
          })
        } else {
          addr = nip19.neventEncode({
            id: bigZap.targetEvent.id,
            relays: [nostrbandRelay]
          })
        }
      } else if (bigZap.targetMeta) {
        addr = nip19.neventEncode({
          id: bigZap.targetMeta.id,
          relays: [nostrbandRelay]
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.plugins.toast.showShortBottom(`Target events not found`)
      }
      console.log('bigZap addr', addr, bigZap)

      handleOpenContextMenu({ bech32: addr })
    },
    [handleOpenContextMenu]
  )

  const handleReloadBigZaps = useCallback(async () => {
    if (contactList) {
      dispatch(setBigZaps({ bigZaps: null }))
      const bigZaps = await fetchFollowedZaps(contactList.contactPubkeys, MIN_ZAP_AMOUNT).catch(() => {
        dispatch(setBigZaps({ bigZaps: null }))
      })
      dispatch(setBigZaps({ bigZaps }))
    }
  }, [contactList, dispatch])

  const renderContent = useCallback(() => {
    if (bigZaps === null) {
      return <SkeletonBigZaps />
    }
    if (!bigZaps || !bigZaps.length) {
      return <EmptyListMessage onReload={handleReloadBigZaps} />
    }
    return bigZaps.map((bigZap, i) => (
      <ItemBigZap
        key={i}
        onClick={() => handleOpenBigZap(bigZap)}
        time={bigZap.created_at}
        subtitle={`+${Math.round(bigZap.amountMsat / 1000)} sats`}
        targetPubkey={bigZap.targetPubkey}
        targetMeta={bigZap.targetMeta}
      />
    ))
  }, [bigZaps, handleReloadBigZaps, handleOpenBigZap])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Big Zaps
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={225}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
})
