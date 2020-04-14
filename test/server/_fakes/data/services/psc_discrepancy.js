const serviceData = {
  reportDetailsGet: {
    links: {
        "self": "/psc-discrepancy-reports/cc1a2751-2eaf-4f44-bbf2-2b81d6e562a8"
    },
    etag: "2ad6a31a300cdf9be3b2faf52aa73eea73767dfc",
    kind: "psc_discrepancy_report#psc_discrepancy_report",
    obliged_entity_email: "m@m.com"
  },
  obligedEntityEmailPost: {
    links: {
      links: {
        self: "/psc-discrepancy-reports/f3cea2d7-5995-4168-a800-389e81b0bc65/discrepancies/self"
      }
    },
    etag: "29c241cf9cc104ff8d9c2d1c734d4d66969f65d2",
    kind: "psc_discrepancy_report#psc_discrepancy_report",
    obliged_entity_email: "m@m.com"
  },
  companyNumberPost: {
    links: {
      links: {
        self: "/psc-discrepancy-reports/f3cea2d7-5995-4168-a800-389e81b0bc65/discrepancies/self"
      }
    },
    etag: "29c241cf9cc104ff8d9c2d1c734d4d66969f65d2",
    kind: "psc_discrepancy_report#psc_discrepancy_report",
    obliged_entity_email: "m@m.com",
    company_number: "12345678"
  },
  discrepancyDetailsPost: {
    links: {
      self: "/psc-discrepancy-reports/cc1a2751-2eaf-4f44-bbf2-2b81d6e562a8/discrepancies/ad899747-948c-46f1-89f8-7f33b7ec5956",
        "psc-discrepancy-reports": "/psc-discrepancy-reports/cc1a2751-2eaf-4f44-bbf2-2b81d6e562a8"
    },
    etag: "8653beaf072bf7d8f16ae785a68d481d41ce945c",
    kind: "psc_discrepancy#psc_discrepancy_report",
    details: "something here"
  }
};

module.exports = serviceData;
