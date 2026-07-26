declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

declare module '*.mp3' {
    const content: string;
    export default content;
}

declare module 'react-pdf' {
    import { ComponentType } from 'react';

    export const Document: ComponentType<any>;
    export const Page: ComponentType<any>;
    export const pdfjs: {
        GlobalWorkerOptions: {
            workerSrc: string;
        };
    };
}
