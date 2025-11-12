import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [
    require('tailwindcss-logical'),
    require('./src/@core/tailwind/plugin'),
    function ({ addBase }: any) {
      addBase({
        '.fc-h-event': { backgroundColor: 'transparent' }
      })
    }
  ],
  theme: {
    extend: {}
  }
}

export default config
