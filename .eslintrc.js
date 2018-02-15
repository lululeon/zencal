module.exports = {
  "env": {
    "browser": true,
    "node":true,
    "commonjs": true,
    "es6": true
  },
  "plugins": ["react"],
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "parser": "babel-eslint",
  "rules": {
    "strict": 0,
    "indent": [
      "error",
      2,
      {SwitchCase: 1}
    ],
    "linebreak-style": "off",
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-console": "off"
  }
};