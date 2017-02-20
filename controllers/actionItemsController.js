var db = require('../models');

// app.get('/api/bills/:billsId/actionItems', controllers.actionItems.index);
function index(req, res) {
  db.bill.findById(req.params.billId, function(err, foundBill) {
    console.log('responding with actionItems:', foundBill.actionItems);
    res.json(foundBill.actionItems);
  });
}

// POST '/api/bills/:billsId/actionItems'
function create(req, res) {
  db.bill.findById(req.params.billId, function(err, foundBill) {
    console.log(req.body);
    var newActionItems = new db.actionItem(req.body);
    // dangerous, in a real app we'd validate the incoming data
    foundBill.actionItems.push(newActionItems);
    foundBill.save(function(err, savedBill) {
      console.log('newActionItems created: ', newActionItems);
      res.json(newActionItems);
      // responding with just the actionItem, some APIs may respond with the parent object (bill in this case)
    });
  });
}


//app.put('/api/bills/:billsId/actionItems/:actionItemsId',
//controllers.actionItems.update);
function update(req, res) {
  db.bill.findById(req.params.billId, function(err, foundBill) {
    console.log(foundBill);
    // we've got the bill, now find the actionItem within it
    var correctActionItem = foundBill.actionItems.id(req.params.actionItemsId);
    if (correctActionItem) {
      console.log(req.body);
      correctActionItem.title = req.body.title;
      correctActionItem.description = req.body.description;
      correctActionItem.dueDate = req.body.dueDate;
      correctActionItem.status = req.body.status;

      foundBill.save(function(err, saved) {
        console.log('UPDATED', correctActionItem, 'IN ', saved.actionItems);
        res.json(correctActionItem);
      });
    } else {
      res.send(404);
    }
  });

}

// app.delete('/api/bills/:billsId/actionItems/:actionItemId',
// controllers.actionItems.destroy);
function destroy(req, res) {
  db.bill.findById(req.params.billId, function(err, foundBill) {
    console.log(foundBill);
    // we've got the bill, now find the action item within it
    var correctActionItem = foundBill.actionItems.id(req.params.actionItemId);
    if (correctActionItem) {
      correctActionItem.remove();
      // resave the bill now that the action item is gone
      foundBill.save(function(err, saved) {
        console.log('REMOVED ', correctActionItem.title, 'FROM ', saved.actionItems);
        res.json(correctActionItem);
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
