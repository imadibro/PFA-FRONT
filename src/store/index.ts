import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import taskReducer from './slices/taskSlice'

// Function to create the store (for SSR compatibility)
export const makeStore = () =>
  configureStore({
    reducer: {
      task: taskReducer
    }
  })

export const wrapper = createWrapper(makeStore)

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>
export type AppDispatch = ReturnType<typeof makeStore>['dispatch']
