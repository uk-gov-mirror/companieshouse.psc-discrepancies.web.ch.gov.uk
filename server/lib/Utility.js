/*
 * General purpose class containing stand-alone utility methods
 */
const logger = require(`${serverRoot}/config/winston`);

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

  /**
   * Central logger for application errors, exceptions and promise rejections
   */
  static logException (err, category = 'appError') {
    const status = typeof err.statusCode !== 'undefined' ? err.statusCode : (err.status || 500);
    logger.error(`${status} - ${category}: ${err.stack}`);
  }
}

module.exports = Utility;
