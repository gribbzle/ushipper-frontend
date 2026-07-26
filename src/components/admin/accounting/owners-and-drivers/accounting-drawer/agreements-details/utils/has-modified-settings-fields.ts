export const hasModifiedDriverSettings = (modified?: { [key: string]: boolean }) =>
    modified ? Object.keys(modified).some(key => key.startsWith('driverSettings.') && modified[key] === true) : false;

export const hasModifiedFuelCardsSettings = (modified?: { [key: string]: boolean }) =>
    modified ? Object.keys(modified).some(key => key.startsWith('fuelCardsSettings.') && modified[key] === true) : false;
