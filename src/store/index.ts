import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createWrapper } from 'next-redux-wrapper'
import taskReducer from './slices/taskSlice'
import { api } from './api'

// Function to create the store (for SSR compatibility)
export const makeStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      task: taskReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
  })

setupListeners(makeStore().dispatch)

export const wrapper = createWrapper(makeStore)

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>
export type AppDispatch = ReturnType<typeof makeStore>['dispatch']
