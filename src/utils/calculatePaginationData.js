export const calculatePaginationData =({totalItmes, page, perPage})=>{
const totalPages = Math.ceil(totalItmes / perPage);
const hasNextPage = page === totalPages;
const hasPrevPage = page > 1;
return {
    totalItmes,
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
};
};