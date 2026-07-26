import { useRouter } from 'next/router';

export const useTabValueFromUrl = () => {
    const router = useRouter();
    const { statisticsStatus } = router.query;

    return { statisticsStatus };
};
