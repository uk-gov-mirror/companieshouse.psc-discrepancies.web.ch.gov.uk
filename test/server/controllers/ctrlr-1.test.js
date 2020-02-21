
describe('controller/Ctrlr-1', () => {

  let app = require('./../../../server/app');

  beforeEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  afterEach(done => {
    sinon.reset();
    sinon.restore();
    done();
  });

  it('should serve up the index page', () => {
    let slug = '/ctrlr-1';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200)
      });
  });

  it('should serve up the action-one', () => {
    let slug = '/ctrlr-1/action-one';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(200);
      });
  });

  it('should fail to serev up an invalid path', () => {
    let slug = '/company/list/all';
    return request(app)
      .get(slug)
      .then(response => {
        expect(response).to.have.status(404);
      });
  });

});
