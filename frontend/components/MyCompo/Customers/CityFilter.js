import { createFilterOptions } from '@mui/material/Autocomplete';
// Custom filter
export const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => option.name + ", " + option.stateCode,
    trim: false,
    ignoreAccents: true,
    ignoreCase: true,
});

export const customFilter = (options, { inputValue }) => {
    // Start filtering only when at least 3 characters are typed
    if (inputValue.length < 3) return [];

    const filtered = filterOptions(options, { inputValue });

    const beginsWith = filtered.filter(option =>
        option.name.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    const containsOrEndsWith = filtered.filter(option =>
        !option.name.toLowerCase().startsWith(inputValue.toLowerCase()) &&
        (option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.name.toLowerCase().endsWith(inputValue.toLowerCase()))
    );

    return [...beginsWith, ...containsOrEndsWith];
};
