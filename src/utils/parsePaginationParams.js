const parseTheNumber = (number, defaultValue) => {
if(typeof number !== "string") return defaultValue;
const parsedNumber = parseInt(number);
if(Number.isNaN(parsedNumber)) return defaultValue;
return parsedNumber;
};

//is it parsedNumber or parseTheNumber in Number.isNaN  ????
export const parsePaginationParams = ({page, perPage}) => {
const parsedPage = parseTheNumber(page, 1);
const parsedPerPage = parseTheNumber(perPage, 10);
return {
    page: parsedPage,
    perPage: parsedPerPage,
};
};