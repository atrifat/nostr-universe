import { getProfileName } from '@/utils/helpers/prepare-data'
import { StyledProfile, StyledProfileAvatar, StyledProfileName, StyledAboutProfile } from './styled'
import { IProfile } from './types'
import { useProfileImageSource } from '@/hooks/profile-image'

export const Profile = ({ profile, isContact, onClick = () => { } }: IProfile) => {

  const name = getProfileName(profile.pubkey, profile)
  const src = useProfileImageSource({
    pubkey: profile.pubkey,
    originalImage: profile.profile?.picture
  })

  const about = profile.profile?.about

  return (
    <StyledProfile onClick={() => onClick(profile)}>
      <StyledProfileAvatar src={src} />
      <StyledProfileName>{name}</StyledProfileName>
      {!isContact && <StyledAboutProfile variant="caption">{about}</StyledAboutProfile>}
    </StyledProfile>
  )
}
