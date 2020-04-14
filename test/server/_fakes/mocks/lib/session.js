module.exports.responseMock = {
  cookie: () => {
    return true;
  },
  locals: {}
};

module.exports.requestMockWithSessionCookie = {
  cookies: {
    PSC_SID: 'abc123'
  }
};

module.exports.requestMockWithoutSessionCookie = {
  cookies: {}
};

module.exports.sessionStoreLoadResolves = {
  run: () => {
    return Promise.resolve({
      extract: () => {
        return { one: "two" };
      }
    });
  }
};

module.exports.sessionStoreLoadRejects = {
  run: () => {
    return Promise.reject(false);
  }
};

module.exports.sessionStoreWriteResolves = {
  run: () => {
    return Promise.resolve(true);
  }
};

module.exports.sessionStoreWriteRejects = {
  run: () => {
    return Promise.reject(false);
  }
};

module.exports.sessionData = {
  id: 'abc123',
    appData: {
      initialServiceResponse: {
        links: {
            self: "/psc-discrepancy-reports/abc123"
        },
        etag: "4a16b4ffc0269c0397f97dd8398c39da1f388536",
        kind: "psc_discrepancy_report#psc_discrepancy_report",
        obliged_entity_email: "m@m.com"
      }
    },
    accountData: {}
};
