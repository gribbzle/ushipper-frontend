import { useEffectOnce } from './use-effect-once';

export const useScrollTop = (querySelector: string) => {
    useEffectOnce(() => {
        const content = document.querySelector(querySelector) as Element;

        if (content) {
            content.scrollTop = 0;
        }
    });
};
