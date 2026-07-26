import { useRouter } from 'next/router';

export const useIsAdminPage = () => {
    const { pathname } = useRouter();

    return pathname.substring(0, 7) === '/admin/';
};
