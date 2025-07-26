import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import TailwindTypo from '@tailwindcss/typography'

export default {
	content: ['./src/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans],
			},
			colors: {
				primary: '#3730a3',
				secondary: '#e5e7eb',
				accent: '#f59e0b',
				danger: '#ef4444',
				success: '#10b981',
				warning: '#f97316',
				info: '#3b82f6',
				dark: '#111827',
				light: '#f3f4f6',

				primaryLight: '#ede9fe',
				secondaryLight: '#f3f4f6',
				accentLight: '#fef3c7',
				dangerLight: '#fee2e2',
				successLight: '#dcfce7',
				warningLight: '#ffedd5',
				infoLight: '#dbeafe',
			},
		},
		plugins: [TailwindTypo],
	},
} satisfies Config
