import { useState } from "react";

interface Props<T> {
    items: T[];
    orderItems: () => T[];
    pageSize?: number;
}

export function useListPagination<T>(props: Props<T>) {
    const ITEMS_PER_PAGE = props.pageSize ?? 8;

    const [currentPage, setCurrentPage] = useState(1);

    const paginatedHistory = (): T[] => {
        const ordered = props.orderItems();
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return ordered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const totalPages = Math.ceil((props.items?.length || 0) / ITEMS_PER_PAGE);

    return {
        totalPages,
        currentPage,
        itemsPaginated: paginatedHistory(),
        back: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
        next: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
    };
}
