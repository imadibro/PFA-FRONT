'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from './index'
import ReactQueryProvider from './queryClientProvider'

const store = makeStore()

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </Provider>
  )
}

export default ReduxProvider
