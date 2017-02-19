var db = require('../models');

// app.get('/api/bills/:billsId/actionItems', controllers.actionItems.index);
function index(req, res) {
  db.Bill.findById(req.params.billsId, function(err, foundBill) {
    console.log('responding with actionItems:', foundBill.actionItems);
    res.json(foundBill.actionItems);
  });
}

// POST '/api/bills/:billsId/actionItems'
function create(req, res) {
  db.Bill.findById(req.params.billsId, function(err, foundBill) {
    console.log(req.body);
    var newactionItems = new db.actionItem(req.body);  // dangerous, in a real app we'd validate the incoming data
    foundBill.actionItems.push(newactionItems);
    foundBill.save(function(err, savedBill) {
      console.log('newactionItems created: ', newactionItems);
      res.json(newactionItems);  // responding with just the actionItem, some APIs may respond with the parent object (bill in this case)
    });
  });
}

// app.delete('/api/bills/:billsId/actionItems/:actionItemId', controllers.actionItems.destroy);
function destroy(req, res) {
  db.Bill.findById(req.params.billsId, function(err, foundBill) {
    console.log(foundBill);
    // we've got the bill, now find the action item within it
    var correctactionItems = foundBill.actionItems.id(req.params.actionItemId);
    if (correctactionItems) {
      correctactionItems.remove();
      // resave the bill now that the actionItem is gone
      foundBill.save(function(err, saved) {
        console.log('REMOVED ', correctactionItems.name, 'FROM ', saved.actionItems);
        res.json(correctactionItems);
      });
    } else {
      res.send(404);
    }
  });
}

//app.put('/api/bills/:billsId/actionItems/:actionItemId', controllers.actionItems.update);
function update(req, res) {
  db.Bill.findById(req.params.billsId, function(err, foundBill) {
    console.log(foundBill);
    // we've got the bill, now find the actionItem within it
    var correctActionItems = foundBill.actionItems.id(req.params.actionItemId);
    if (correctActionItems) {
      console.log(req.body);
      correctActionItems.title = req.body.title;
      correctActionItems.description = req.body.description;
      correctActionItems.dueDate = req.body.dueDate;
      correctActionItems.status = req.body.status;

      foundBill.save(function(err, saved) {
        console.log('UPDATED', correctActionItems, 'IN ', saved.actionItems);
        res.json(correctActionItems);
      });
    } else {
      res.send(404);
    }
  });

}

module.exports = {
  index: index,
  create: create,
  update: update,
  destroy: destroy
};
