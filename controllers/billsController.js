var db = require('../models');

// GET /api/bills
function index(req, res) {
  // send back all bills as JSON
  db.bill.find({}, function(err, allBills) {
    res.json(allBills);
  });
}

// POST /api/albums
function create(req, res) {
  // create an album based on request body and send it back as JSON
  console.log('body', req.body);

  /* split at comma and remove and trailing space
  var keywords = req.body.keywords.split(',').map(function(item) { return item.trim(); } );
  req.body.keywords = keywords;
  */

  db.bill.create(req.body, function(err, bill) {
    if (err) { console.log('error', err); }
    console.log(bill);
    res.json(bill);
  });
}

// GET /api/bills/:billId
function show(req, res) {
  // find one bill by id and send it back as JSON
  db.bill.findById(req.params.billId, function(err, foundBill) {
    if(err) { console.log('billsController.show error', err); }
    console.log('billsController.show responding with', foundBill);
    res.json(foundBill);
  });
}


// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  //destroy: destroy,
  //update: update
};
