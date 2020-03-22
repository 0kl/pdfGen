module.exports = {
    // "parser": "babel-eslint", // for react
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType":"module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread":true
        }
    },
    "extends": "airbnb",
    "rules": {
        // allow console and debugger in development
        'no-console': 1,
        'no-debugger': 2,
        'no-redeclare':2,
        // 'no-underscore-dangle':0
        "indent": ["error", "tab"],
        "semi": "error",
        "template-curly-spacing": ["error", "always"],
        "quotes": ["error", "single"],
        "no-multi-spaces": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-trailing-spaces": "error",
        "no-tabs": 0,
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "dot-notation": ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }],
      },
      "plugins":['jest'],
      "env": {
        "jest/globals": true
      }
};