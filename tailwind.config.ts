import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import TailwindTypo from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [TailwindTypo],
} satisfies Config;
