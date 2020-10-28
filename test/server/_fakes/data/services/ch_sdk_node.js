const sdkData = {
  getCompanyPsc: {
    httpStatusCode: 200,
    resource: {
      itemsPerPage: 25,
      totalResults: 1,
      activeCount: 1,
      startIndex: 0,
      ceasedCount: null,
      links: {
        self: '/company/00006400/persons-with-significant-control'
      },
      items: [
        {
          natures_of_control: [
            'ownership-of-shares-25-to-50-percent-as-person'
          ],
          name: 'James Potter',
          links: {
            self: '/company/01234567/persons-with-significant-control/individual/L2m6DxTJA0pkUNh9SIcJY8_cdWE'
          },
          etag: 'fe416d8a3e09c93eb961ad89b0c606982c3c01e1',
          name_elements: {
            forename: 'James',
            surname: 'Potter'
          },
          nationality: 'British',
          country_of_residence: 'Wales',
          address: {
            postal_code: 'CF14 3UZ',
            locality: 'Cardiff',
            region: 'South Glamorgan',
            address_line_1: 'Crown Way'
          },
          notified_on: '2016-01-01',
          date_of_birth: {
            year: 1981,
            month: 4
          }
        }
      ]
    }
  },
  getCompanyProfile: {
    company_number: '12345678',
    company_name: 'Test Company 1'
  }
};

module.exports = sdkData;
