export const emptyGetServerSideProps = async () => {
    return {
        props: {},
    };
};

export const isClientSide = () => typeof window !== 'undefined';

export const isServerSide = () => !isClientSide();
