const fakeSampleServiceOneData = {
  getList: {
    rowCount: 2,
    fetchedRows:[
    {
      id: 1,
      item_id: 'xCgtRfo',
      item_name: 'Example 2',
      parent: null
    },
      {
        id: 2,
        item_id: 'dG5Ylod',
        item_name: 'Example 3',
        parent: 1
      }
    ]
  },
  getDetails: {
    fetchedRows:[{
      id: 1,
      item_id: 'xCgtRfo',
      item_name: 'Example 1',
      parent: null
    }],
    affectedRows: null,
    rowCount: 1
  },
  saveDetails: {
    affectedRows:[{
      id: 11,
      item_id: 'tfGh8W',
      item_name: 'Example 3',
      parent: null
    }],
    affectedRows: 1,
    rowCount: 1
  }
};

module.exports = fakeSampleServiceOneData;
