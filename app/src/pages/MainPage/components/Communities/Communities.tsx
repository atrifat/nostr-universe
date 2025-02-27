import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { fetchFollowedCommunities } from '@/modules/nostr'
import { StyledTitle, StyledWrapper } from './styled'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { CommunityEvent } from '@/types/communities'
import { setCommunities } from '@/store/reducers/contentWorkspace'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { SkeletonCommunities } from '@/components/Skeleton/SkeletonCommunties/SkeletonCommunities'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { ItemCommunity } from '@/components/ItemsContent/ItemCommunity/ItemCommunity'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

export const Communities = memo(function Communities() {
  const { communities, contactList } = useAppSelector((state) => state.contentWorkSpace)
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const dispatch = useAppDispatch()

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'communities'
      }
    })
  }

  const handleOpenCommuniti = useCallback(
    (event: CommunityEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleReloadCommunities = useCallback(async () => {
    if (contactList) {
      dispatch(setCommunities({ communities: null }))
      const communities = await fetchFollowedCommunities(contactList.contactPubkeys).catch(() => {
        dispatch(setCommunities({ communities: null }))
      })
      dispatch(setCommunities({ communities }))
    }
  }, [dispatch, contactList])

  const renderContent = useCallback(() => {
    if (communities === null) {
      return (
        <HorizontalSwipeContent childrenWidth={225}>
          <SkeletonCommunities />
        </HorizontalSwipeContent>
      )
    }
    if (!communities || !communities.length) {
      return <EmptyListMessage onReload={handleReloadCommunities} />
    }

    const Row: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const community = communities[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={communities.length}>
          <ItemCommunity
            onClick={() => handleOpenCommuniti(community)}
            time={community.last_post_tm}
            content={community.description}
            subtitle={`+${community.posts} posts`}
            name={`/${community.name}`}
            picture={community.image}
          />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHeight={141}
        itemSize={225}
        itemCount={communities.length}
        RowComponent={Row}
      />
    )
  }, [communities, handleReloadCommunities, handleOpenCommuniti])

  const isVisible = Boolean(communities && communities.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Active communities
          {isVisible && (
            <IconButton color="light" size="small" onClick={handleOpenFeedModal}>
              <OpenInFullOutlinedIcon fontSize="inherit" />
            </IconButton>
          )}
        </StyledTitle>
      </Container>
      {renderContent()}
    </StyledWrapper>
  )
})
