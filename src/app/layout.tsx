import '@/styles/globals.css'

import { Inter, Reddit_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
})
const firaSans = Reddit_Sans({
	subsets: ['latin'],
	display: 'swap',
	weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

interface Props {
	children: ReactNode
	modal: ReactNode
	loader: ReactNode
	search: ReactNode
}

export default function RootLayout({ children }: Readonly<Props>) {
	return (
		<html lang="en" className={`${inter.className}`}>
			<head>
				<title>Echoed</title>
			</head>
			<body className="mx-auto min-h-screen max-w-[90%] overflow-y-scroll md:max-w-[70%]">
				<Toaster />
				{children}
				<div id="overlays"></div>
			</body>
		</html>
	)
}
