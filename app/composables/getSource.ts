export const useGetSource = (id: number) => {
    return useFetch(`/api/source/${id}`);
};
