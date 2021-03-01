const { Encoding } = require('ch-node-session-handler/lib/encoding/Encoding');

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
        return { one: 'two' };
      }
    });
  }
};

module.exports.sessionStoreLoadResolvesRead = {
  load: () => {
    return {
      run: () => {
        return Promise.resolve({
          extract: () => {
            return { one: 'two' };
          }
        });
      }
    };
  }
};

module.exports.sessionStoreLoadRejects = {
  run: () => {
    return Promise.reject(new Error());
  }
};

module.exports.sessionStoreWriteResolves = {
  run: () => {
    return Promise.resolve(true);
  }
};

module.exports.sessionStoreWriteRejects = {
  load: () => {
    return {
      run: () => {
        return Promise.reject(new Error());
      }
    };
  }
};

module.exports.sessionData = {
  id: 'abc123',
  appData: {
    initialServiceResponse: {
      links: {
        self: '/psc-discrepancy-reports/f3cea2d7-5995-4168-a800-389e81b0bc65'
      },
      etag: '29c241cf9cc104ff8d9c2d1c734d4d66969f65d2',
      kind: 'psc_discrepancy_report#psc_discrepancy_report',
      obliged_entity_type: 'Financial institution'
    },
    pscs: {
      psc_0werf: {
        name: 'Matte Le-Matt',
        dob: '11/1956',
        dobView: 'Born November 1956'
      },
      psc_1wGGrf: {
        name: 'Matte Le-Matt',
        dob: '09/1990',
        dobView: 'Born November 1956'
      }
    },
    selectedPscDetails: {
      name: 'PSC missing',
      dob: '',
      details: 'hello'
    }
  },
  accountData: {}
};

const SIGNED_IN_ID = '4ZhJ6pAmB5NAJbjy/6fU1DWMqqrk';
const SIGNED_IN_SIGNATURE = 'Ak4CCqkfPTY7VN6f9Lo5jHCUYpM';
module.exports.SIGNED_IN_COOKIE = SIGNED_IN_ID + SIGNED_IN_SIGNATURE;

module.exports.sessionSignedIn = Encoding.encode({
  '.client.signature': SIGNED_IN_SIGNATURE,
  '.id': SIGNED_IN_ID,
  expires: Date.now() + 3600 * 1000,
  signin_info: {
    access_token: {
      access_token: 'oKi1z8KY0gXsXu__hy2-YU_JJSdtxOkJ4K5MAE-gOFVzpKt5lvqnFpVeUjhqhVHZ1K8Hkr7M4IYdzJUnOz2hQw',
      expires_in: 3600,
      refresh_token: 'y4YXof84bkUeBZlavRlAGfdq5VMkpPm6UR0OYwPvI6i6UDmtEiTQ1Ro-HGCGo01y4ploP4Kdwd6H4dEh8-E_Fg',
      token_type: 'Bearer'
    },
    signed_in: 1
  }
});

const SIGNED_OUT_ID = '2VsqkD1ILMqzO0NyuL+ubx4crUCP';
const SIGNED_OUT_SIGNATURE = '9L9X4DGu5LOaE2yaGjPk+vGZcMw';
module.exports.SIGNED_OUT_COOKIE = SIGNED_OUT_ID + SIGNED_OUT_SIGNATURE;

module.exports.sessionSignedOut = Encoding.encode({
  '.client.signature': SIGNED_OUT_SIGNATURE,
  '.id': SIGNED_OUT_ID,
  expires: Date.now() + 3600 * 1000,
  signin_info: {
    access_token: {
      access_token: 'oKi1z8KY0gXsXu__hy2-YU_JJSdtxOkJ4K5MAE-gOFVzpKt5lvqnFpVeUjhqhVHZ1K8Hkr7M4IYdzJUnOz2hQw',
      expires_in: 3600,
      refresh_token: 'y4YXof84bkUeBZlavRlAGfdq5VMkpPm6UR0OYwPvI6i6UDmtEiTQ1Ro-HGCGo01y4ploP4Kdwd6H4dEh8-E_Fg',
      token_type: 'Bearer'
    },
    signed_in: 0
  }
});
