import { useRef, useState } from "react";

export function filter(name, filter) {
    return {
        name,
        filter,
    };
}

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
