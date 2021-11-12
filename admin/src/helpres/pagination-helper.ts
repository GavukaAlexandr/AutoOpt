export const computePage = (currentPage: number, pageSize: number): number => {
    const isFirstPage = currentPage === 1;
    const firstPage = 0;
    const nextPage = currentPage * pageSize - pageSize;

    return isFirstPage ? firstPage : nextPage;
}