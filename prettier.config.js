/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const prettierConfig = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 8,
  useTabs: true,
  bracketSameLine: true,
  singleQuote: true,
  trailingComma: "all",
  semi: false,
  printWidth: 120,
  arrowParens: "avoid",
  endOfLine: "lf",
};
  
export default prettierConfig