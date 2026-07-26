import { useEffect, useRef } from 'react';
import { NextRouter, useRouter } from 'next/router';

export default function usePrevRoute() {
    const router = useRouter();

    const ref = useRef<NextRouter | null>(null);

    useEffect(() => {
        ref.current = router;
    }, [router]);

    return ref.current;
}
