$(document).ready(function() {
//GET all the bills to render to page
  $.ajax({
    method: 'GET',
    url: '/api/bills',
    success: renderMultipleBills
  });

//dropdown menu to filter bills by Issues
  $(".dropdown-toggle").dropdown();

//POSTs new bill from add bill dropdown form
  $('#bill-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
      method: 'POST',
      url: '/api/bills',
      data: formData,
      success: renderBill  //render the server's response
    });
    $(this).trigger("reset");
  });

  //EDIT MENU
  //catch and handle click on Edit, Save, Delete and Cancel-Edit Bill buttons
  $('#bills').on('click', '.edit-bill', handleBillEditClick);
  $('#bills').on('click', '.save-bill', handleSaveChangesClick);
  $('#bills').on('click', '.delete-bill', handleDeleteBillClick);
  $('#bills').on('click', '.cancel-edit', handleCancelEditClick);

  //DROPDOWN FILTER BY ISSUES MENU
  //catch and handle clicks in the filter by issues dropdown menu
  $('#issues').on('click', '.funding', filterBillsByFunding)
  $('#issues').on('click', '.vouchers', filterBillsByVouchers)
  $('#issues').on('click', '.affordability', filterBillsByAffordability)
  $('#issues').on('click', '.dept-of-ed', filterBillsByDeptOfEd)
  $('#issues').on('click', '.allbills', getAllBills)

  //ACTION ITEMS
  // catch and handle the click on an add action item button
  $('#bills').on('click', '.add-actionItem', handleAddActionItemClick);
  // save action items modal save button
  $('#saveActionItem').on('click', handleNewActionItemSubmit);
  $('#bills').on('click', '.edit-actionItems', handleEditActionItemsClick);
  // edit action items modal triggers
  $('#editActionItemsModalBody').on('click', 'button.btn-danger', handleDeleteActionItemClick);
  $('#editActionItemsModal').on('click', 'button#editActionItemsModalSubmit', handleUpdateActionItemsSave);

  //ADD NEW BILL FORM
  //click add bill button to get dropdown add bill form
  $(function(){
    $('legend').click(function(){
      $(this).nextAll('div').toggle("hidden");
    });
  });

  $('#bill-form').on('click', '.close-add-bill', handleCloseAddBillClick);
});
//End of Document Ready Function!

//Saves edited/updated actionItems
function handleUpdateActionItemsSave(event) {
  // build all the actionItems objects
  var $modal = $('#editActionItemsModal');
  if($modal.find('form').length < 1) {
    // if there are no form elements, then there are no actionItems to update
    $modal.modal('hide');
    return;
  }
  var billId = $modal.find('form').data('bill-id');
  var updatedActionItems = [];
    $modal.find('form').each(function () {
      var aactionItem = {};
      aactionItem._id = $(this).attr('id');
      aactionItem.title = $(this).find('input.actionItem-title').val();
      aactionItem.description = $(this).find('input.actionItem-description').val();
      aactionItem.dueDate = $(this).find('input.actionItem-dueDate').val();
      aactionItem.status = $(this).find('input.actionItem-status').val();
      updatedActionItems.push(aactionItem);
    });
    $modal.modal('hide');
    updateMultipleActionItems(billId, updatedActionItems);
}

//PUT - updates multiple action items after editing
function updateMultipleActionItems(billId, actionItems) {
  var url = '/api/bills/' + billId + '/actionItems/';
  var deferreds = [];
  actionItems.forEach(function(actionItem) {
    var ajaxCall = $.ajax({
      method: 'PUT',
      url: url + actionItem._id,
      data: actionItem,
      error: function(err) { console.log('Error updating action item',
      actionItem.title, err); }
    });
    deferreds.push(ajaxCall);
  });
  // wait for all the deferreds, refetch and re-render the bill
  $.when.apply(null, deferreds).always(function() {
    fetchAndReRenderBillWithId(billId);
  });
}

//once actionItems are updated, fetches and re-renders bills to page
function fetchAndReRenderBillWithId(billId) {
  $.get('/api/bills/' + billId, function(data) {
    // remove current bill
    $('div[data-bill-id=' + billId + ']').remove();
    // re-render bill with new actionItems
    renderBill(data);
  });
}

// when a delete button in the edit actionItems modal is clicked
function handleDeleteActionItemClick(e) {
  e.preventDefault();
  var actionItemId = $(this).data('ai-id');
  var billId = $(this).closest('form').data('bill-id');
  var url = '/api/bills/' + billId + '/actionItems/' + actionItemId;
  $.ajax({
    method: 'DELETE',
    url: url,
    success: handleActionItemDeleteResponse
  });
}

function handleActionItemDeleteResponse(data) {
  var actionItemId = data._id;
  var $formRow = $('form#' + actionItemId);
  var billId = $formRow.data('bill-id');
  // remove that actionItem edit form
  $formRow.remove();
  fetchAndReRenderBillWithId(billId);
}

// when edit songs button clicked
function handleEditActionItemsClick(e) {
  var $billRow = $(this).closest('.bill');
  var billId = $billRow.data('bill-id');
  $.get('/api/bills/' + billId + "/actionItems", function(actionItems) {
    populateEditActionItemsModal(actionItems, billId);
    $('#editActionItemsModal').modal();
  });
}

// takes an array of actionItems and generates an EDIT form
function populateEditActionItemsModal(actionItems, billId) {
  var editActionItemsFormsHtml = buildEditActionItemsForms(actionItems, billId);
  // find the modal's body and replace it with the generated html
  $('#editActionItemsModal').modal();
  $('#editActionItemsModalBody').html(editActionItemsFormsHtml);
}

// create edit form for each action item, using the same billId
function buildEditActionItemsForms(actionItems, billId) {
  var actionItemEditFormHtmlStrings = actionItems.map(function(actionItem){
    return (`
      <form class="form-inline" id="${actionItem._id}" data-bill-id="${billId}" >

        <div class="form-group">
          <input type="text" class="form-control actionItem-title" value="${actionItem.title}">
        </div>

        <div class="form-group">
          <input type="text" class="form-control actionItem-description" value="${actionItem.description}">
        </div>

        <div class="form-group">
          <input type="text" class="form-control actionItem-dueDate" value="${actionItem.dueDate}">
        </div>

        <div class="form-group">
          <input type="text" class="form-control actionItem-status" value="${actionItem.status}">
        </div>

        <div class="form-group">
          <button class="btn btn-danger" data-ai-id="${actionItem._id}">x</button>
        </div>
      </form>
    `);
  });
  return actionItemEditFormHtmlStrings.join(""); //combine into single string
}

//handles the click on the Edit button of each bill, renders edit bill form
function handleBillEditClick(e){
  var $billRow = $(this).closest('.bill');
  var billId = $billRow.data('bill-id');
    // show the save changes/delete buttons
  $billRow.find('.save-bill').toggleClass('hidden');
  $billRow.find('.delete-bill').toggleClass('hidden');
  $billRow.find('.cancel-edit').toggleClass('hidden');
  // hide the edit button
  $billRow.find('.edit-bill').toggleClass('hidden');
  // get the bill title and replace its field with an input element
  var billTitle = $billRow.find('span.bill-title').text();
  $billRow.find('span.bill-title').html('<input class="edit-bill-title form-control" value="' + billTitle + '"></input>');
  // get the bill summary and replace its field with an input element
  var billSummary = $billRow.find('span.bill-summary').text();
  $billRow.find('span.bill-summary').html('<input class="edit-bill-summary form-control" value="' + billSummary + '"></input>');
  // get the bill sponsor and replace its field with an input element
  var billSponsor = $billRow.find('span.bill-sponsor').text();
  $billRow.find('span.bill-sponsor').html('<input class="edit-bill-sponsor form-control" value="' + billSponsor + '"></input>');
  // get the bill text url and replace its field with an input element
  var billTextUrl = $billRow.find('.bill-text-url').attr('href');
  $billRow.find('.bill-text-url').html('<input class="edit-bill-text-url form-control" value="' + billTextUrl + '"></input>');
  // get the bill latest action and replace its field with an input element
  var billLatestAction = $billRow.find('span.bill-latest-action').text();
  $billRow.find('span.bill-latest-action').html('<input class="edit-bill-latest-action form-control" value="' + billLatestAction + '"></input>');
  // get the bill issues and replace its field with an input element
  var billIssues = $billRow.find('span.bill-issues').text();
  $billRow.find('span.bill-issues').html('<input class="edit-bill-issues form-control" value="' + billIssues + '"></input>');
}

// after editing the bill, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var billId = $(this).closest('.bill').data('bill-id');
  var $billRow = $('[data-bill-id=' + billId + ']');
  var data = {
    title: $billRow.find('.edit-bill-title').val(),
    summary: $billRow.find('.edit-bill-summary').val(),
    sponsor: $billRow.find('.edit-bill-sponsor').val(),
    textUrl: $billRow.find('.edit-bill-text-url').val(),
    latestAction: $billRow.find('.edit-bill-latest-action').val(),
    };

  $.ajax({
    method: 'PUT',
    url: '/api/bills/' + billId,
    data: data,
    success: handleBillUpdatedResponse
  });
}

//onsuccess function of put ajax call PUTing data for bill
function handleBillUpdatedResponse(data) {
  var billId = data._id;
  $('[data-bill-id=' + billId + ']').remove();
  renderBill(data);
  $('[data-bill-id=' + billId + ']')[0].scrollIntoView();
}

// when a delete button for a bill is clicked
function handleDeleteBillClick(e) {
  var billId = $(this).parents('.bill').data('bill-id');
  $.ajax({
    url: '/api/bills/' + billId,
    method: 'DELETE',
    success: handleDeleteBillSuccess
  });
}

// callback after DELETE /api/bills/:id
function handleDeleteBillSuccess(data) {
  var deletedBillId = data._id;
  $('div[data-bill-id=' + deletedBillId + ']').remove();
}

// cancels edits in edit bills form and returns to homepage
function handleCancelEditClick(e) {
  window.location.reload();
}

function getBillsAndRender(params) {
  // remove existing html and add loader
  $('#bills').html('');
  $.ajax({
    method: 'GET',
    url: '/api/bills',
    data: params,
    success: renderMultipleBills
  });
}

// initial onsuccess function to GET all bills and render them to page
function renderMultipleBills(bills) {
  bills.forEach(function(bill) {
    renderBill(bill);
  });
}

//renders actionItems to modal
function renderActionItem(actionItem){
  return `<span>
          <p><h4>${actionItem.title}</h4></p>
          <p><strong>Description</strong></p>
          <p> ${actionItem.description}</p>
          <p><strong>Due: </strong> ${actionItem.dueDate} </p>
          <p><strong>Status: </strong> ${actionItem.status} </p>
          </span>`
}

// onsuccess function of POST which renders add bill form input to page
function renderBill(bill) {
  bill.actionItemsHtml = bill.actionItems.map(renderActionItem).join('');
  var billHtml = (`
    <div class='row bill' data-bill-id='${bill._id}'>
      <div class='col-md-8 col-md-offset-2'>
        <div class='panel panel-default'>
          <div class='panel-body'>

          <!-- begin bill internal row -->
            <div class='row'>
              <div class='col-md-9 col-md-offset-1'>
                <ul class='list-group'>
                  <li class='list-group-item'>
                    <h4 class='inline-header'>Bill Title:</h4>
                    <span class='bill-title'>${bill.title} </span>
                  </li>
                  <li class='list-group-item'>
                    <h4 class='inline-header'>Summary:</h4>
                    <span class='bill-summary'>${bill.summary}</span>
                  </li>
                  <li class='list-group-item'>
                    <h4 class='inline-header'>Sponsor:</h4>
                    <span class='bill-sponsor'>${bill.sponsor}</span>
                  </li>
                  <li class='list-group-item'>
                    <h4 class='inline-header'>Text:</h4>
                    <a class='bill-text-url' href="${bill.textUrl}">Read Text
                    </a>
                  </li>
                  <li class='list-group-item'>
                    <h4 class='inline-header'>Latest Action:</h4>
                    <span class='bill-latest-action'>${bill.latestAction}</span>
                  </li>
                  <li class='list-group-item'>
                    <h4 class='inline-header'>Find Legislation That Affects You:</h4>
                    <span class='bill-issues'>${bill.issues}</span>
                  </li>

                  <li class="list-group-item">
                  <h4 class="inline-header">Action Items:</h4>
                  <span class='bill-actionItems'>${bill.actionItemsHtml}</span>
                </li>
                </ul>
              </div>

              <div class='col-md-2 text-center'>
                <div><button type='submit' class='btn btn-primary btn-lg
                edit-bill'><span class="glyphicon glyphicon-pencil"></span></button></div> <br/>
                <div><button type='submit' class='btn btn-success btn-lg save-bill
                hidden'>Save</button></div> <br/>
                <div><button type='submit' class='btn btn-danger btn-lg delete-bill
                hidden'><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></div> <br/>
                <div><button type='submit' class='btn btn-default btn-lg cancel-edit
                hidden'>Cancel</button></div> <br/>
              </div>
            </div>

            <!-- end of bill internal row -->
            <div class='panel-footer col-md-9 col-md-offset-1'>
              <div class='panel-footer action-items'>
                <button class='btn btn-primary btn-lg add-actionItem'>Add Action Item</button>
                <button class='btn btn-info btn-lg edit-actionItems'>Edit Action Items</button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end one bill -->`);

  $('#bills').append(billHtml);
}

//filters bills by funding issue in dropdown menu
function filterBillsByFunding(e){
  getBillsAndRender({
    type: 'Funding'
  });
}

//filters bills by vouchers issue in dropdown menu
function filterBillsByVouchers(e){
  getBillsAndRender({
    type: 'Vouchers'
  });
}

//filters bills by affordability issue in dropdown menu
function filterBillsByAffordability(e){
  getBillsAndRender({
    type: 'Affordability'
  });
}

//filters bills by dept-of-ed issue in dropdown menu
function filterBillsByDeptOfEd(e){
  getBillsAndRender({
    type: 'Dept of Education'
  });
}

//gets all bills when all bills is clicked in issues dropdown
function getAllBills(e){
  window.location.reload();
}

//handles close add bill form click by refreshing and hiding form
function handleCloseAddBillClick(e){
  $('legend').nextAll('div').toggle("hidden");
  $('#bill-form form')[0].reset();
}

// when the add action item button is clicked, display the modal
function handleAddActionItemClick(e) {
  var currentBillId = $(this).closest('.bill').data('bill-id');
  $('#actionItemModal').data('bill-id', currentBillId);
  $('#actionItemModal').modal();  // display the modal
}

// when the action item modal submit button is clicked:
function handleNewActionItemSubmit(e) {
  e.preventDefault();
  var $modal = $('#actionItemModal');
  var $actionItemTitleField = $modal.find('#actionItemTitle');
  var $actionItemDescriptionField = $modal.find('#actionItemDescription');
  var $actionItemDueDateField = $modal.find('#actionItemDueDate');
  var $actionItemStatusField = $modal.find('#actionItemStatus');
  // get data from modal fields
  var dataToPost = {
    title: $actionItemTitleField.val(),
    description: $actionItemDescriptionField.val(),
    dueDate: $actionItemDueDateField.val(),
    status: $actionItemStatusField.val()
  };
  var billId = $modal.data('billId');
  // POST to SERVER
  var actionItemPostToServerUrl = '/api/bills/'+ billId + '/actionItems';
  $.post(actionItemPostToServerUrl, dataToPost, function(data) {
    // clear form
    $actionItemTitleField.val(''),
    $actionItemDescriptionField.val(''),
    $actionItemDueDateField.val(''),
    $actionItemStatusField.val('')
    // close modal
    $modal.modal('hide');
    // update the correct bill to show new action item
    fetchAndReRenderBillWithId(billId);
  });
}
