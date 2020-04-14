const errorManifest = require(`${serverRoot}/lib/errors/error_manifest`).validation;

class Validator {

  constructor() {
    this.errors = {};
    this.payload = {};
  }

  _getErrorSignature () {
    return {
      status: 400,
      code: 'VALIDATION_ERRORS',
      message: errorManifest.default.summary,
      stack: {}
    }
  }

  isValidEmail(email) {
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      let validEmailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]+$/);
      if(typeof email === 'undefined' || email === null || email.length === 0){
        errors.stack.email = errorManifest.email.blank;
        reject(errors);
      } else if(!validEmailRegex.test(email)) {
        errors.stack.email = errorManifest.email.incorrect;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }

  isTextareaNotEmpty(text) {
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      let notEmptyRegex = new RegExp(/[a-zA-Z]+/);
      if(typeof text === "undefined" || text === null || !notEmptyRegex.test(text)) {
        errors.stack.details = errorManifest.details;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }

  isCompanyNumberFormatted(number) {
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      if(typeof number === "undefined" || number === null || number.length === 0) {
        errors.stack.number = errorManifest.number.empty;
        reject(errors);
      } else if (number.length !== 8) {
        errors.stack.number = errorManifest.number.incorrect;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }

  isValidContactName(contactName) {
    let errors = this._getErrorSignature();
    return new Promise((resolve, reject) => {
      let validNameRegex = new RegExp(/^[ a-zA-Z'-]*$/);
      if(typeof contactName === 'undefined' || contactName === null || contactName.length === 0){
        errors.stack.fullName = errorManifest.fullName.empty;
        reject(errors);
      } else if(!validNameRegex.test(contactName)) {
        errors.stack.fullName = errorManifest.fullName.incorrect;
        reject(errors);
      } else {
        resolve(true);
      }
    });
  }
}

module.exports = Validator;
