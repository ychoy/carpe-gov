var db = require('../models');

// GET /api/bills
function index(req, res) {
  // send back all bills as JSON
  db.bill.find({}, function(err, allBills) {
    res.json(allBills);
  });
}

function update(req, res) {
  // find one bill by id, update it based on request body,
  // and send it back as JSON
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

// export public methods here
module.exports = {
  index: index,
  //create: create,
  //show: show,
  //destroy: destroy,
  update: update
};
