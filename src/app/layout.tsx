// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import ReduxProvider from '@/providers/redux-provider'
import SessionsProvider from '@/providers/session-provider'
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Globale Horizon',
  description: 'Globale Horizon - Planning project.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction}>
      <SessionsProvider>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <ReduxProvider>{children}</ReduxProvider>
        </body>
      </SessionsProvider>
    </html>
  )
}

export default RootLayout
