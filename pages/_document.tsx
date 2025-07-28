import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="dark scroll-smooth">
      <Head />
      <body className="bg-black antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}