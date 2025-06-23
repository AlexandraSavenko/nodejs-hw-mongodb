const parseBoolean = bln => {
if(typeof bln !== "string") return;
return bln === "true";
};
export const parseContactFilterParams = ({ isFavourite}) => {
const parsedIfFavourite = parseBoolean(isFavourite);
return parsedIfFavourite;
};