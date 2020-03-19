let ErrorManifest = {
  email: {
    summary: "Enter your email address",
    inline: "Enter your email address"
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
  }
}

module.exports = ErrorManifest;