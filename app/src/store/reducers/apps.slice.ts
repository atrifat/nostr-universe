import { AppNostr } from '@/types/app-nostr'
import { createSlice } from '@reduxjs/toolkit'

interface IAppsState {
  apps: AppNostr[]
  isLoading: boolean
}

const initialState: IAppsState = {
  apps: [],
  isLoading: false
}

export const appsSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setApps: (state, action) => {
      state.apps = action.payload.apps
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading
    }
  }
})

export const { setApps, setLoading } = appsSlice.actions
