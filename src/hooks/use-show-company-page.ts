import { useCallback } from 'react';

export const useShowCompanyPage = () => {
    const handleShowCompanyPage = useCallback((companyId: string) => {
        const aliasPath = `/companies/${companyId}`;

        window.open(aliasPath, '_blank');
    }, []);

    return { handleShowCompanyPage };
};
