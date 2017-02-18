var db = require('../models');

// GET /api/bills
function index(req, res) {
  // send back all bills as JSON
  db.bill.find({}, function(err, allBills) {
    res.json(allBills);
  });
}

// POST /api/bills
function create(req, res) {
  // create an bill based on req body and send it back as JSON
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

// PUT /api/bills/:billId
function update(req, res) {
  // find one bill by id, update it based on req body and send it back as JSON
  console.log('updating with data', req.body);
  db.bill.findById(req.params.billId, function(err, foundBill) {
    if(err) { console.log('billsController.update error', err); }
    foundBill.title = req.body.title;
    foundBill.summary = req.body.summary;
    foundBill.sponsor = req.body.sponsor;
    foundBill.textUrl = req.body.textUrl;
    foundBill.latestAction = req.body.latestAction;
    foundBill.save(function(err, savedBill) {
      if(err) { console.log('saving altered bill failed'); }
      res.json(savedBill);
    });
  });
}

// DELETE /api/bills/:billId
function destroy(req, res) {
  // find one bill by id, delete it, and send it back as JSON
  db.bill.findOneAndRemove({ _id: req.params.billId }, function(err, foundBill){
    res.json(foundBill);
  });
}

// export public methods here
module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};
