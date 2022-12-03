import { NextUIProvider } from '@nextui-org/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@uniswap/widgets/fonts.css';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme } from '@nextui-org/react';
import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider
} from '@livepeer/react';
import { AuthContextProvider } from '../context/AuthContext';

const darkTheme = createTheme({
  type: 'dark'
});

const client = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY })
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <LivepeerConfig client={client}>
        <NextUIProvider theme={darkTheme}>
          <Component {...pageProps} />
        </NextUIProvider>
      </LivepeerConfig>
    </AuthContextProvider>
  );
}
