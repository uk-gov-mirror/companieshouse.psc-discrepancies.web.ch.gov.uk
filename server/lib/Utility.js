/*
 * General purpose class containing stand-alone utility methods
 */

class Utility {
  /**
   * Generate a random alphanumeric string
   *
   * @param {number} min - minimum string length
   * @param {number} max - maximum string length
   * @return {string} str
   */
  static getRandomString (min, max) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charLength = chars.length;
    const len = Math.floor(Math.random() * (max - min + 1)) + min;
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return str;
  }
}

module.exports = Utility;
