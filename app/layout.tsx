import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Provider } from './provider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Twitter X',
	description: 'Twitter X is a Twitter clone with Next.js and MongoDB',
	icons: { icon: '/images/x.svg' },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='dark' style={{ colorScheme: 'dark' }}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Provider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</Provider>
			</body>
		</html>
	)
}
