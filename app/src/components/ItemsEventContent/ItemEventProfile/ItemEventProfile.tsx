import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { ExpandMore, StyledItemSelectedEventActions } from './styled'
import { MetaEvent } from '@/types/meta-event'
import { ContentCollapse } from '@/shared/ContentComponents/ContentCollapse/Content'
import { KindView } from '@/shared/ContentComponents/KindView/KindView'
import { kindNames } from '@/consts'
import { WebsiteView } from '@/shared/ContentComponents/WebsiteView/WebsiteView'

interface IItemEventProfile {
  event: {
    content?: string
    author?: MetaEvent
    pubkey: string
    kind: number
    website?: string
  }
}

export const ItemEventProfile = ({ event }: IItemEventProfile) => {
  const MAX_LENGTH_CONTENT = 200
  const [openContent, setOpenContent] = useState(false)

  const handleExpandClick = () => {
    setOpenContent((prev) => !prev)
  }

  const kind = kindNames[event.kind] || event.kind

  return (
    <Wrapper>
      <Head>
        <ProfileInfo profile={event.author} pubkey={event.pubkey} />
      </Head>

      {event.website && (
        <WebsiteView url={event.website} />
      )}
      {event.content && (
        <ContentCollapse maxContentLength={MAX_LENGTH_CONTENT} open={openContent} text={event.content} />
      )}

      <StyledItemSelectedEventActions>
        <KindView>{kind}</KindView>
        {event.content && event.content.length > MAX_LENGTH_CONTENT && (
          <ExpandMore expand={openContent} onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </StyledItemSelectedEventActions>
    </Wrapper>
  )
}
