module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "prettier", "react"],
  rules: {
    "prettier/prettier": ["error"],
    "react/prop-types": 0,
    "react/jsx-indent": "off",
    "react/jsx-one-expression-per-line": 0,
    "react/jsx-closing-tag-location": 0,
    "react/jsx-pascal-case": [
      "error",
      {
        allowAllCaps: true,
        ignore: [],
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "react/no-deprecated": "off",
    "no-console": "error",
    "no-debugger": "error",
    "no-duplicate-imports": ["error", { includeExports: true }],
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false,
      },
    ],
  },
};
