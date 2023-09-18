import { APP_NOSTRO_SIZE } from '@/consts'

const SIZE_VALUE = {
  [APP_NOSTRO_SIZE.LARGE]: 100,
  [APP_NOSTRO_SIZE.MEDIUM]: 80,
  [APP_NOSTRO_SIZE.SMALL]: 60,
  [APP_NOSTRO_SIZE.EXTRA_SMALL]: 50
}

const FONT_SIZE_VALUE = {
  [APP_NOSTRO_SIZE.LARGE]: 36,
  [APP_NOSTRO_SIZE.MEDIUM]: 24,
  [APP_NOSTRO_SIZE.SMALL]: 24,
  [APP_NOSTRO_SIZE.EXTRA_SMALL]: 10
}

export const APP_NAME_FONT_SIZE_VALUE = {
  [APP_NOSTRO_SIZE.LARGE]: FONT_SIZE_VALUE[APP_NOSTRO_SIZE.LARGE],
  [APP_NOSTRO_SIZE.MEDIUM]: FONT_SIZE_VALUE[APP_NOSTRO_SIZE.MEDIUM],
  [APP_NOSTRO_SIZE.SMALL]: FONT_SIZE_VALUE[APP_NOSTRO_SIZE.SMALL],
  [APP_NOSTRO_SIZE.EXTRA_SMALL]: FONT_SIZE_VALUE[APP_NOSTRO_SIZE.EXTRA_SMALL]
}

export const APP_NOSTRO_SIZE_VALUE = {
  [APP_NOSTRO_SIZE.LARGE]: {
    height: SIZE_VALUE[APP_NOSTRO_SIZE.LARGE],
    width: SIZE_VALUE[APP_NOSTRO_SIZE.LARGE]
  },
  [APP_NOSTRO_SIZE.MEDIUM]: {
    height: SIZE_VALUE[APP_NOSTRO_SIZE.MEDIUM],
    width: SIZE_VALUE[APP_NOSTRO_SIZE.MEDIUM]
  },
  [APP_NOSTRO_SIZE.SMALL]: {
    height: SIZE_VALUE[APP_NOSTRO_SIZE.SMALL],
    width: SIZE_VALUE[APP_NOSTRO_SIZE.SMALL]
  },
  [APP_NOSTRO_SIZE.EXTRA_SMALL]: {
    height: SIZE_VALUE[APP_NOSTRO_SIZE.EXTRA_SMALL],
    width: SIZE_VALUE[APP_NOSTRO_SIZE.EXTRA_SMALL]
  }
}
