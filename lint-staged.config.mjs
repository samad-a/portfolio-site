const config = {
  "*.{js,mjs,cjs,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,yml,yaml}": "prettier --write",
  // tsc checks the whole project, so it runs once without file arguments.
  "*.{ts,tsx}": () => "tsc --noEmit",
};

export default config;
