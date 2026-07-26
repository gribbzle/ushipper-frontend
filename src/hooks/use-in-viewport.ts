import { useEffect, useRef, useState } from 'react';

const useInViewport = () => {
    const [isInViewport, setIsInViewport] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const targetElement = itemRef.current;

        if (!targetElement) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setIsInViewport(entry.isIntersecting);
                });
            },
            {
                root: null, // Use the viewport as the root
                rootMargin: '0px',
                threshold: 0.5, // Adjust this threshold as needed
            },
        );

        observer.observe(targetElement);

        return () => {
            observer.disconnect();
        };
    }, []);

    return { itemRef, isInViewport };
};

export default useInViewport;
