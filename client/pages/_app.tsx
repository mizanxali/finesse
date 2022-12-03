import { NextUIProvider } from '@nextui-org/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { createTheme } from '@nextui-org/react';
import { AuthContextProvider } from '../context/AuthContext';

const darkTheme = createTheme({
  type: 'dark'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <NextUIProvider theme={darkTheme}>
        <Component {...pageProps} />
      </NextUIProvider>
    </AuthContextProvider>
  );
}
