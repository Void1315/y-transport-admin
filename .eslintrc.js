module.exports = {
    env: {
        "es6": true,
        "node": true,
        "browser": true
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react'],
    extends: ["eslint:recommended", 'plugin:react/recommended'],
    rules: {
        // 禁止使用 var
        'no-var': "error",
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ],
        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxEOF: 1
        }],
        "indent": ["error", 2],
        "no-unused-vars": [0]
    },
    parserOptions: {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        }
    }
}