import React, { createContext } from 'react';
import { PhotoProvider } from 'react-photo-view';
import { PhotoProviderProps } from 'react-photo-view/dist/PhotoProvider';

import 'react-photo-view/dist/react-photo-view.css';

export const ImageProviderContext = createContext(false);

export const ImageProvider = ({ children }: PhotoProviderProps) => (
    <ImageProviderContext.Provider value={true}>
        <PhotoProvider maskOpacity={0.5}>{children}</PhotoProvider>
    </ImageProviderContext.Provider>
);
