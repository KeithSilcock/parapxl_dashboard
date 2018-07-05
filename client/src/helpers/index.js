export function capitalizeFirstLetters(text, everyWord = false) {
  if (everyWord) {
    const words = text.split(" ");
    const newString = [];
    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex];
      try {
        var newWord = `${word[0].toUpperCase()}${word.slice(1)}`;
      } catch (e) {
        if (e instanceof TypeError) {
          var newWord = "";
        } else {
          throw e;
        }
      }

      newString.push(newWord);
    }
    return newString.join(" ");
  } else {
    return `${text[0].toUpperCase()}${text.slice(1)}`;
  }
}
