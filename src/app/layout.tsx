'use client'
import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { type ReactNode } from 'react'
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
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
				<script
					dangerouslySetInnerHTML={{
						__html: `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefers;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
    `,
					}}
				/>
			</head>
			<body className="relative min-h-screen overflow-y-scroll ">
				<div className='mx-auto md:max-w-[100%]'>
					{children}
				</div>
				<div id="overlays"></div>
			</body>
		</html>
	)
}
