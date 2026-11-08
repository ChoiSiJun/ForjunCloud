module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "eslint-config-prettier"
  ],
  "plugins": [
    "react-refresh"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": [
      "./package/home/tsconfig.json",
      "./package/core/tsconfig.json",
      "./storybook/tsconfig.app.json"
    ],
    "tsconfigRootDir": __dirname
  },
  "ignorePatterns": [
    "**/*.css",
    "**/*.json",
    "**/*.lock",
    "dist",
    ".eslintrc.json",
    "**/*.config.*",
    "**/.storybook/**",
    "**/storybook-static/**"
  ],
  "settings": {
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ],
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx",
        ".js"
      ]
    },
    "import/resolver": "node"
  },
  "rules": {
    "import/extensions": "off",
    "react/no-array-index-key": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [
          ".js",
          ".jsx",
          ".tsx",
          ".ts"
        ]
      }
    ],
    "react-refresh/only-export-components": [
      "warn",
      {
        "allowConstantExport": true
      }
    ],
    "react/function-component-definition": [
      2,
      {
        "namedComponents": [
          "arrow-function",
          "function-declaration"
        ],
        "unnamedComponents": "arrow-function"
      }
    ],
    "no-param-reassign": [
      "error",
      {
        "props": false
      }
    ],
    "arrow-body-style": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off"
  },
  "root": true,
  "overrides": [
    {
      "files": [
        "**/*.stories.@(ts|tsx)"
      ],
      "extends": [
        "plugin:storybook/recommended"
      ]
    }
  ]
};
