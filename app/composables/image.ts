export const useImage = (url: string) => {
    const query = new URLSearchParams();
    query.set('url', url);
    return `/api/img?${query.toString()}`;
};
