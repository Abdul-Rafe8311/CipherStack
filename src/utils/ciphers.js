/**
 * Caesar Cipher logic
 */
export const caesarCipher = (text, shift, decrypt = false) => {
  const s = decrypt ? (26 - (shift % 26)) % 26 : shift % 26;
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        let base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + s) % 26) + base);
      }
      return char;
    })
    .join('');
};

/**
 * Utility: Convert string to Hex
 */
const toHex = (str) => {
  return Array.from(str)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Utility: Convert Hex to string
 */
const fromHex = (hex) => {
  try {
    const matches = hex.match(/.{1,2}/g) || [];
    return matches
      .map(byte => String.fromCharCode(parseInt(byte, 16)))
      .join('');
  } catch (e) {
    return hex; // Return as is if not valid hex
  }
};

/**
 * XOR Cipher logic with Hex encoding/decoding
 */
export const xorCipher = (text, key, decrypt = false) => {
  if (!key) return text;

  // 1. If decrypting, the input is expected to be Hex. Convert it back to raw string.
  let input = decrypt ? fromHex(text) : text;
  
  // 2. Apply XOR transformation
  const transformed = input
    .split('')
    .map((char, i) => {
      const charCode = char.charCodeAt(0);
      const keyCode = key.charCodeAt(i % key.length);
      return String.fromCharCode(charCode ^ keyCode);
    })
    .join('');

  // 3. If encrypting, encode the raw XOR result to Hex for readability.
  return decrypt ? transformed : toHex(transformed);
};

/**
 * Vigenere Cipher logic
 */
export const vigenereCipher = (text, keyword, decrypt = false) => {
  if (!keyword) return text;
  const key = keyword.toUpperCase();
  let j = 0;
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        const keyChar = key[j % key.length].charCodeAt(0) - 65;
        const shift = decrypt ? (26 - keyChar) % 26 : keyChar;
        j++;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    })
    .join('');
};

export const ALGORITHMS = {
  CAESAR: 'Caesar',
  XOR: 'XOR',
  VIGENERE: 'Vigenere',
};

export const processNode = (input, node, decrypt = false) => {
  switch (node.type) {
    case ALGORITHMS.CAESAR:
      return caesarCipher(input, parseInt(node.config.shift) || 0, decrypt);
    case ALGORITHMS.XOR:
      return xorCipher(input, node.config.key || '', decrypt);
    case ALGORITHMS.VIGENERE:
      return vigenereCipher(input, node.config.keyword || '', decrypt);
    default:
      return input;
  }
};
