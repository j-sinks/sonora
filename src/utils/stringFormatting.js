// Split the input string by the underscore and capitalise first letter
export const formattedSubgenre = (str) => {
  const words = str.split("_");
  const formattedString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedString;
};

// Split the input string by the underscore
export const splitOnUnderscore = (str) => {
  const formattedString = str.split("_").join(" ");

  return formattedString;
};

// capitaliseFirstLetter
export const capitaliseFirstLetter = (str) => {
  const words = str.split(" ");
  const formattedString = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return firstLetter + restOfWord;
  });
  return formattedString.join(" ");
};
