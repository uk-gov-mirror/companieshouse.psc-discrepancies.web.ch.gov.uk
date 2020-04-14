let ErrorManifest = {
  generic: {
    serverError: {
      summary: "Internal server error. Please try again"
    }
  },
  validation: {
    default: {
      summary: "Your request contains errors",
      inline: "Your request contains errors"
    },
    email: {
      blank: {
        summary: "Enter your email address",
        inline: "Enter your email address"
      },
      incorrect: {
        summary: "Email not valid",
        inline: "Enter an email address in the correct format, like name@example.com"
      }
    },
    details: {
      summary: "Enter the information that is incorrect for the PSC",
      inline: "Enter the information that is incorrect for the PSC"
    },
    number: {
      empty: {
        summary: "Enter the company number",
        inline: "Enter the company number"
      },
      incorrect: {
        summary: "Company number must be 8 characters",
        inline: "Company number must be 8 characters"
      }
    },
    fullName: {
      empty: {
        summary: "Enter your full name",
        inline: "Enter your full name"
      },
      incorrect: {
        summary: "Full name must only include letters a-z, A-Z, hyphens, spaces and apostrophes",
        inline: "Full name must only include letters a-z, A-Z, hyphens, spaces and apostrophes"
      }
    }
  }
}

module.exports = ErrorManifest;
