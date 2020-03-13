const errorManifest = require(`${serverRoot}/lib/validation/error_manifest`)

class Validator {

  constructor() {
    this.errors = {};
    this.payload = {};
  }

  isValidEmail(email) {
    this.errors = {};
    return new Promise((resolve, reject) => {
      let validEmailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]+$/);
      if(validEmailRegex.test(email)) {
        resolve(true);
      } else {
        this.errors.email = errorManifest.email;
        reject(this.errors);
      }
    });
  }

  isTextareaNotEmpty(text) {
    this.errors = {};
    return new Promise((resolve, reject) => {
      let notEmptyRegex = new RegExp(/[a-zA-Z]+/);
      if(typeof text === "undefined" || text === null || !notEmptyRegex.test(text)) {
        this.errors.details = errorManifest.details;
        reject(this.errors);
      } else {
        resolve(true);
      }
    });
  }

}

module.exports = Validator;
