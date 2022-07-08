module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["**/dist/*"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "2021",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "consistent-return": "warn",
    "no-return-await": "warn",
    "no-use-before-define": "warn",
    "no-underscore-dangle": "warn",
    "no-param-reassign": "warn",
    "no-shadow": "warn",
    "import/extensions": "warn",
    "import/prefer-default-export": "warn",
    "import/no-extraneous-dependencies": "warn",
    "import/no-unresolved": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
  },
};
