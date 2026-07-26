import React from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
 * @param components - An object where each key is a component name and the value is the component itself.
 * @param componentType - component type from config.
 * @returns JSX.Element или null
 */

export const renderProjectSpecificComponent = (components: Record<string, React.ReactNode>, componentType: string): JSX.Element | null => {
    const { productMapping } = publicRuntimeConfig;

    const selectedComponentKey = productMapping.components[componentType];
    const selectedComponent = components[selectedComponentKey];

    if (!selectedComponent) {
        console.error(`Component with key ${selectedComponentKey} not found in provided components array.`);

        return null;
    }

    return <>{selectedComponent}</>;
};
