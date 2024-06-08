module.exports = {
  "**/*.{js,ts,jsx,tsx,cjs,mjs,cts,mts,mdx}": [
    "eslint --fix",
    "prettier --write",
    "git add .",
  ],
};
