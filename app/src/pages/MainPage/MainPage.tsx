import { useLocation } from 'react-router-dom'
import { AppPinMenu } from '@/components/AppPinMenu/AppPinMenu'
import { useAppSelector } from '@/store/hooks/redux'
import { Header } from './components/Header/Header'
import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { TabMenu } from './components/TabMenu/TabMenu'
import { ModalSelectApp } from '@/components/Modal/ModalSelectApp/ModalSelectApp'
import { Highlights } from './components/Highlights/Highlights'
import { TrendingNotes } from './components/TrendingNotes/TrendingNotes'
import { BigZaps } from './components/BigZaps/BigZaps'
import { LongPosts } from './components/LongPosts/LongPosts'
import { LiveEvents } from './components/LiveEvents/LiveEvents'
import { Communities } from './components/Communities/Communities'
import { StyledWrapperMain } from './styled'
import { SuggestedProfiles } from './components/SuggestedProfiles/SuggestedProfiles'
import { ModaSearch } from '@/components/Modal/ModaSearch/ModaSearch'
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage'
import { ModaContextMenu } from '@/components/Modal/ModaContextMenu/ModaContextMenu'
import { TabPage } from '../TabPage/TabPage'

export const MainPage = () => {
  const { isOpenTabWindow } = useAppSelector((state) => state.tab)
  const location = useLocation()
  const isShowAppPinMenu = location.pathname !== '/profile'

  return (
    <StyledWrapperMain>
      <Header />
      <TrendingNotes />
      <TrendingProfiles />
      <Highlights />
      <BigZaps />
      <LongPosts />
      <LiveEvents />
      <Communities />
      <SuggestedProfiles />

      <AppsNostro />

      {/* Modal pages */}
      <ProfilePage />
      <ModaContextMenu />
      <ModalSelectApp />
      <ModaSearch />
      <TabPage />

      {isShowAppPinMenu && !isOpenTabWindow && <AppPinMenu />}
      {isOpenTabWindow && <TabMenu />}
    </StyledWrapperMain>
  )
}
