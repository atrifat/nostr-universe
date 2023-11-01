import { Container } from '@/layout/Container/Conatiner'
import { StyledTitle, StyledWrapper } from './styled'
import { userService } from '@/store/services/user.service'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppSelector } from '@/store/hooks/redux'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonProfiles } from '@/components/Skeleton/SkeletonProfiles/SkeletonProfiles'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { Profile } from '@/shared/Profile/Profile'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'

export const SuggestedProfiles = memo(function SuggestedProfiles() {
  const { currentPubkey } = useAppSelector((state) => state.keys)
  const {
    data,
    isFetching: isLoading,
    refetch: refetchSuggestedProfiles
  } = userService.useFetchSuggestedProfilesQuery(currentPubkey, {
    skip: !currentPubkey
  })
  const { handleOpenContextMenu } = useOpenModalSearchParams()

  const handleOpenProfile = useCallback(
    (pubkey: string) => {
      handleOpenContextMenu({ pubkey })
    },
    [handleOpenContextMenu]
  )

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <HorizontalSwipeContent childrenWidth={140}>
          <SkeletonProfiles />
        </HorizontalSwipeContent>
      )
    }

    if (!data || !data.length) {
      const handleReloadSuggestedProfiles = () => refetchSuggestedProfiles()
      return <EmptyListMessage onReload={handleReloadSuggestedProfiles} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = data[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={data.length}>
          <Profile onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return <HorizontalSwipeVirtualContent itemHight={164} itemSize={140} itemCount={data.length} RowComponent={Row} />
  }, [isLoading, data, handleOpenProfile, refetchSuggestedProfiles])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Suggested profiles
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
