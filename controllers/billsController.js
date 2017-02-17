var db = require('../models');

// GET /api/bills
function index(req, res) {
  // send back all bills as JSON
  db.bill.find({}, function(err, allBills) {
    res.json(allBills);
  });
}

// export public methods here
module.exports = {
  index: index,
  //create: create,
  //show: show,
  //destroy: destroy,
  //update: update
};


