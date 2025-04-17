import { useRef, useState } from "react";

export function filter(name, filter) {
    return {
        name,
        filter,
    };
}

/**
 * Custom hook for filtering a list based on multiple filters.
 * It allows applying, removing, toggling, and resetting filters on a list of items.
 *
 * @param {Object} params - The configuration object.
 * @param {Array} params.list - The list of items to be filtered.
 * @param {Array} [params.filters=[]] - An array of filter objects that define the filters available for use.
 * @returns {Object} The return object contains:
 *   - `filtered`: The filtered list based on the active filters.
 *   - `manager`: The manager object for manipulating filters.
 *     - `apply(filterName, payload)`: Activates a filter with the specified name and payload.
 *     - `remove(filterName, payload)`: Deactivates a filter with the specified name and payload.
 *     - `toggle(filterName, payload)`: Toggles the active state of the filter with the specified name and payload.
 *     - `reset()`: Resets all filters to their inactive state.
 *     - `activate()`: Applies the active filters to the original list and updates the filtered list.
 *   - `getFilter(name)`: Retrieves a filter by its name. If `name` is "all", returns all filters.
 *   
 * @example
 * const { filtered, manager, getFilter } = useFilter({
 *   list: items,
 *   filters: [
 *     { 
 *       name: "active", 
 *       filter: (item) => item.status === "active" 
 *     },
 *     { 
 *       name: "highPriority", 
 *       filter: (item) => item.priority === "high" 
 *     }
 *   ]
 * });
 * 
 * // Apply the "active" filter
 * manager.apply("active");
 * 
 * // Get the "active" filter object
 * const activeFilter = getFilter("active");
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
        /**
         * Activates a filter by its name and payload.
         *
         * @param {string} filterName - The name of the filter to activate.
         * @param {any} [payload=null] - The optional payload for the filter.
         * @returns {Object} Returns the `manager` object for method chaining.
         *
         * @example
         * manager.apply("byAuthor", "John"); // Activates the "byAuthor" filter.
         */
        apply(filterName, payload = null) {
            setActivityOf(filterName, payload, () => true);
            return manager;
        },

        /**
         * Deactivates a filter by its name and payload.
         *
         * @param {string} filterName - The name of the filter to deactivate.
         * @param {any} [payload=null] - The optional payload for the filter.
         * @returns {Object} Returns the manager object for method chaining.
         *
         * @example
         * manager.remove("highPriority"); // Deactivate the "highPriority" filter.
         */
        remove(filterName, payload = null) {
            setActivityOf(filterName, payload, () => false);
            return manager;
        },

        /**
         * Toggles the active state of a filter.
         *
         * @param {string} filterName - The name of the filter to toggle.
         * @param {any} [payload=null] - The optional payload for the filter.
         * @returns {Object} Returns the manager object for method chaining.
         * 
         * @example
         * manager.toggle("active"); // Toggles the "active" filter state.
         */
        toggle(filterName, payload = null) {
            setActivityOf(filterName, payload, (filter) => !filter.isActive);
            return manager;
        },

        /**
         * Resets all filters to their inactive state.
         *
         * @returns {Object} Returns the manager object for method chaining.
         * 
         * @example
         * manager.reset(); // Resets all filters to inactive.
         */
        reset() {
            setFilters((prevFilters) =>
                prevFilters.map((filter) => ({
                    ...filter,
                    isActive: false,
                }))
            );
            return manager;
        },
        
        /**
         * Applies the active filters to the original list and updates the filtered list.
         */
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

    /**
     * Retrieves a filter by its name.
     * 
     * @param {string} name - The name of the filter to retrieve.
     * @returns {Object} The filter object if found, or all filters if `name` is "all".
     * 
     * @example
     * const filter = getFilter("active"); // Retrieves the "active" filter object.
     * const allFilters = getFilter("all"); // Retrieves all filters.
     */
    function getFilter(name) {
        if (name?.toLowerCase() === "all") return filters;
        return filters.filter((filter) => filter.name === name)[0];
    }

    return {
        filtered: filteredList,
        manager,
        getFilter,
    };
}