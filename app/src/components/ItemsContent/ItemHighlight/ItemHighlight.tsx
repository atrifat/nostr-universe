import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemHighlight } from './types'

export const ItemHighlight = ({ pubkey, author, time, content }: IItemHighlight) => {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo pubkey={pubkey} profile={author} />
        <Time date={time} />
      </Head>
      <Content isHighlight>{content}</Content>
    </Wrapper>
  )
}
