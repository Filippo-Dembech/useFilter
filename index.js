import { useRef, useState } from "react";

export function filter(name, filter) {
    return {
        name,
        filter,
    };
}

/**
 * # `useFilter`
 *
 * A declarative and imperative-friendly filtering hook designed to handle multiple user-defined filters.
 * 
 * ## ⚡️ Core Idea
 *
 * - This hook doesn't assume what kind of data you're filtering.
 * - The filtered list is returned using the property name `_` (underscore).
 * - The underscore acts as a placeholder, allowing the user to assign a semantic name at the call site.
 * 
 * ## 💡Example Usage
 *
 * Example Usage:
 * 
 * ```jsx
 * const { _: filteredBooks, filters, director } = useFilter({ list: books, filters: [...] });
 * const { _: filteredCountries } = useFilter({ list: countries });
 * ```
 * 
 * This way the hook remains generic, and the user can give context-appropriate names to the filtered list.
 * 
 * ## 👉 Why not return an array?
 *
 * Arrays would force the user to rely on the positional order of returned values, making the code harder to read and maintain.
 * Using object destructuring with `_` promotes semantic clarity while keeping the hook flexible and decoupled from the data's meaning.
 * 
 * @param {{list, filters}}  
 * @returns { _, manager, filters }
 */
export function useFilter({ list, filters: fltrs = [] }) {
    const [filters, setFilters] = useState(() =>
        fltrs.map((filter) => ({
            ...filter,
            isActive: false,
            payload: null,
        }))
    );

    const [filteredList, setFilteredList] = useState(list);
    const originalList = useRef(list);

    function setActivityOf(filterName, payload = null, activity) {
        setFilters((filters) =>
            filters.map((filter) =>
                filter.name === filterName
                    ? { ...filter, isActive: activity(filter), payload }
                    : filter
            )
        );
    }
    
    const manager = {
        apply(filterName, payload = null) {
            setActivityOf(filterName, payload, () => true);
            return manager;
        },

        remove(filterName, payload = null) {
            setActivityOf(filterName, payload, () => false);
            return manager;
        },

        toggle(filterName, payload = null) {
            setActivityOf(filterName, payload, (filter) => !filter.isActive);
            return manager;
        },

        reset() {
            setFilters((prevFilters) =>
                prevFilters.map((filter) => ({
                    ...filter,
                    isActive: false,
                }))
            );
            return manager;
        },
        activate() {
            setFilters((currentFilters) => {
                setFilteredList(() =>
                    originalList.current.filter((item) =>
                        currentFilters
                            .filter((filter) => filter.isActive)
                            .every((filter) =>
                                filter.filter(item, filter.payload)
                            )
                    )
                );
                return currentFilters;
            });
        },
    };
    
    function getFilter(name) {
        if (name?.toLowerCase() === "all")
            return filters 
        return filters.filter(filter => filter.name === name)[0]
    }

    return {
        filtered: filteredList,
        manager,
        getFilter,
    };
}
