export const useGetResource = (id: number) => {
    return useFetch(`/api/resource/${id}`);
};
