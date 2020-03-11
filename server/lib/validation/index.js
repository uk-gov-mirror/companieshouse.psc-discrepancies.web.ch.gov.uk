const errorManifest = require(`${serverRoot}/lib/validation/error_manifest`)

class Validator {

  constructor() {
    this.errors = {};
    this.payload = {};
  }

  isValidEmail(email) {
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

}

module.exports = Validator;
