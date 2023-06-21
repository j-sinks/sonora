// Split the input string by the underscore and capitalise first letter
export const formattedSubgenre = (str) => {
  const words = str.split("_");
  const formattedString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedString;
};

// Split the input string by the underscore and capitalise first letter
export const splitOnUnderscore = (str) => {
  const formattedString = str.split("_").join(" ");

  return formattedString;
};
