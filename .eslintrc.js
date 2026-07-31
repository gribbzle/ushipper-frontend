module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'next/core-web-vitals',
        'plugin:cypress/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    plugins: ['react-hooks', 'import', 'react', 'cypress', 'simple-import-sort', 'dirnames', 'unicorn', 'unused-imports', 'prettier'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    globals: {
        JSX: 'readonly',
    },
    rules: {
        quotes: ['warn', 'single', { avoidEscape: true }],
        'comma-dangle': ['warn', 'always-multiline'],
        'comma-spacing': ['warn', { before: false, after: true }],
        'comma-style': ['warn', 'last'],
        'computed-property-spacing': ['warn', 'never'],
        'func-call-spacing': ['warn', 'never'],
        'key-spacing': ['warn'],
        'no-trailing-spaces': ['warn'],
        'no-whitespace-before-property': ['warn'],
        'padding-line-between-statements': [
            'warn',
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        ],
        'quote-props': ['warn', 'as-needed'],
        semi: ['warn'],
        'semi-spacing': ['warn'],
        'semi-style': ['warn'],
        'space-before-blocks': ['warn'],
        'space-in-parens': ['warn'],
        'space-infix-ops': ['warn'],
        'space-unary-ops': ['warn'],
        'switch-colon-spacing': ['warn'],
        'no-shadow': 'off',
        // This rules conflicts with prettier formatter
        'operator-linebreak': 'off',
        'implicit-arrow-linebreak': 'off',
        'max-len': 'off',
        // Override default airbnb rules
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-negated-condition': 'warn',
        'default-case': 'off',
        'no-use-before-define': 'off',
        // code smell detection
        complexity: ['warn', 20],
        'max-nested-callbacks': 'warn',
        'no-restricted-properties': [
            'error',
            {
                object: 'it',
                property: 'only',
                message: "Did you forget to remove 'only' from this test?",
            },
            {
                object: 'describe',
                property: 'only',
                message: "Did you forget to remove 'only' from this test?",
            },
            {
                object: 'context',
                property: 'only',
                message: "Did you forget to remove 'only' from this test?",
            },
            {
                object: 'test',
                property: 'only',
                message: "Did you forget to remove 'only' from this test?",
            },
        ],
        // React
        'react/jsx-indent': ['warn', 4],
        'react/jsx-indent-props': ['warn', 4],
        'react/jsx-fragments': ['warn', 'syntax'],
        'react/static-property-placement': ['error', 'static public field'],
        'react/state-in-constructor': ['error', 'never'],
        'react/prop-types': 'off',
        'react/sort-comp': 'off',
        'react/require-default-props': 'off',
        'react/jsx-boolean-value': ['error', 'always'],
        'react/jsx-props-no-spreading': 'off',
        'react/prefer-stateless-function': 'off',
        'react/destructuring-assignment': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
        'react/jsx-one-expression-per-line': 'off',
        // Imports, file extensions
        // 'import/no-extraneous-dependencies': [
        //     'error',
        //     { devDependencies: ['**/*.{stories,test,tests,spec}.{js,jsx,ts,tsx}'] },
        // ],
        'import/no-extraneous-dependencies': 'off',
        'import/no-cycle': 'error',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/no-useless-path-segments': [
            'error',
            {
                noUselessIndex: true,
            },
        ],
        // KEBAB
        'dirnames/match-kebab-case': 'off',
        'unicorn/filename-case': 'off',
        'simple-import-sort/imports': [
            'warn',
            {
                groups: [
                    // Node.js builtins. You could also generate this regex if you use a `.js` config.
                    // Packages. `react` related packages come first.
                    ['react', '^[A-Za-z0-9-]+', '@fastify', '@material-ui', '@reduxjs/toolkit'],
                    // Alias.
                    ['^@/?\\w'],
                    // Root path for project
                    ['^#'],
                    // Parent imports. Put `..` last.
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    // Style imports.
                    ['^.+\\.s?css$'],
                ],
            },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-undef': 'error',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
        'react/no-unescaped-entities': 'off',
        'jsx-quotes': [2, 'prefer-single'],
        'no-multiple-empty-lines': [2, { max: 1, maxEOF: 0 }],

        'arrow-parens': ['error', 'as-needed'],
        // 'no-extra-parens': ['error', 'all'], TO DO: there is confict with prettier
        'padded-blocks': ['error', 'never'],
        'react/jsx-tag-spacing': ['error'],
        'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

        '@typescript-eslint/ban-ts-comment': ['warn'],

        '@next/next/no-img-element': ['off'],
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
};
