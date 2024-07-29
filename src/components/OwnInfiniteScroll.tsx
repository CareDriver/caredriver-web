import React, { useEffect, useState, useRef } from "react";

type InfiniteScrollProps = {
    fetcher: () => Promise<void>;
    hasMore: boolean;
    loader: React.ReactNode;
    children: React.ReactNode;
};

const OwnInfiniteScroll: React.FC<InfiniteScrollProps> = ({
    fetcher,
    hasMore,
    loader,
    children,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading || !hasMore) return;

        const handleObserver = async (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting) {
                setIsLoading(true);
                await fetcher();
                setIsLoading(false);
            }
        };

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(handleObserver);
        if (loaderRef.current) observer.current.observe(loaderRef.current);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [isLoading, hasMore, fetcher]);

    return (
        <div>
            {children}
            <div ref={loaderRef}>{isLoading && loader}</div>
        </div>
    );
};

export default OwnInfiniteScroll;
