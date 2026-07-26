import { toCamelCase } from 'js-convert-case';

import { Region } from '@store/api/regions-api';
import { State } from '@store/api/states-api';

export const createStateSuggestion = (state: State) => ({
    value: `${state.title} (${state.alpha2})`,
    state: state.alpha2,
    lat: null,
    long: null,
});

export const createRegionSuggestion = (region: Region) => ({
    value: region.title,
    description: region.states.join(', '),
    region: toCamelCase(region.key),
    lat: null,
    long: null,
});

export const createDivider = (label: string) => ({ value: label, divider: true });
