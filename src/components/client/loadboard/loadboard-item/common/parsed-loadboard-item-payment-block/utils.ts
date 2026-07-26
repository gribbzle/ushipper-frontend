export const getOrderSource = (source: string): string =>
    source
        .split('_')
        .filter(comp => comp !== 'parsed')
        .map(comp => comp.charAt(0).toUpperCase() + comp.slice(1))
        .join('');
