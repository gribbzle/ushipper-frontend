import React from 'react';
import { Head, Html, Main, NextScript } from 'next/document';

import { isFreightX } from '@utils/project-config';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <link rel='shortcut icon' href={`/public/${isFreightX ? 'favicon2.ico' : 'favicon.ico'}`} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
