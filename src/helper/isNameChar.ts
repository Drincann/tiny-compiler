/**
 * Check the input char is a part of(or whole) a name token or not.
 * @param char input char
 * @returns is a valid char part of a name?
 */
export const isNameChar = (char: string) => {
  switch (char) {
    case 'a':
    case 'b':
    case 'c':
    case 'd':
    case 'e':
    case 'f':
    case 'g':
    case 'h':
    case 'i':
    case 'j':
    case 'k':
    case 'l':
    case 'm':
    case 'n':
    case 'o':
    case 'p':
    case 'q':
    case 'r':
    case 's':
    case 't':
    case 'u':
    case 'v':
    case 'w':
    case 'x':
    case 'y':
    case 'z':
      return true;
    default:
      return false;
  }
}