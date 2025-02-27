import { useSearchParams } from 'react-router-dom'
import { Avatar, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CircularProgress from '@mui/material/CircularProgress'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import {
  StyledAppLogo,
  StyledContainerButton,
  StyledHeader,
  StyledIconButton,
  StyledPageTitle,
  StyledWrapper
} from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { FC } from 'react'
import { useSync } from '@/hooks/sync'

type HeaderProps = {
  title: string | React.ReactNode
}

export const Header: FC<HeaderProps> = ({ title = 'Apps' }) => {
  const [searchParams] = useSearchParams()
  const { handleOpen } = useOpenModalSearchParams()
  const { currentProfile } = useAppSelector((state) => state.profile)
  const { currentTabId } = useAppSelector((state) => state.tab)
  const id = searchParams.get('tabId') || ''
  const syncState = useSync()

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledAppLogo onClick={() => handleOpen(MODAL_PARAMS_KEYS.ABOUT_MODAL)} />
        <StyledPageTitle>{title}</StyledPageTitle>
        <StyledContainerButton>
          <IconButton color="inherit" size="medium" onClick={() => handleOpen(MODAL_PARAMS_KEYS.WALLET_MODAL)}>
            <AccountBalanceWalletOutlinedIcon />
          </IconButton>
          {syncState.todo > 0 && (
            <IconButton color="inherit" size="medium" onClick={() => handleOpen(MODAL_PARAMS_KEYS.SYNC_MODAL)}>
              <CircularProgress
                size={20}
                thickness={6}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              />
            </IconButton>
          )}

          {currentTabId && (
            <IconButton
              color="inherit"
              size="medium"
              onClick={() => handleOpen(MODAL_PARAMS_KEYS.TAB_MENU, { search: { tabId: id } })}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </StyledContainerButton>
        <StyledIconButton onClick={() => handleOpen(MODAL_PARAMS_KEYS.PROFILE_PAGE)}>
          <Avatar src={getProfileImage(currentProfile)} />
        </StyledIconButton>
      </StyledHeader>
    </StyledWrapper>
  )
}
