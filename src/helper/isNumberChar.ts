/**
 * Check the input char is a part of(or whole) a number token or not
 * @param char input char
 * @returns is a valide char part of a number?
 */
export const isNumberChar = (char: string) => {
  switch (char) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      return true;
    default:
      return false;
  };
}; 