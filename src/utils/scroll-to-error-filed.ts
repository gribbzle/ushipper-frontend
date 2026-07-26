export const scrollToFirstErrorField = () => {
    const formContainer = document.querySelector('.order-general-form');

    if (!formContainer) {
        return;
    }

    const firstErrorElement = formContainer.querySelector('.form-helper-text--error')?.parentNode as Element;

    if (firstErrorElement) {
        firstErrorElement?.scrollIntoView({ behavior: 'smooth' });
    }
};
