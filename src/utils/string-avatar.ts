export const stringAvatar = (userName: string) => {
    return userName
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('');
};
