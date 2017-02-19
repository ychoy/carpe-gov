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

  //catch and handle click on Edit, Save, Delete and Cancel-Edit Bill buttons
  $('#bills').on('click', '.edit-bill', handleBillEditClick);
  $('#bills').on('click', '.save-bill', handleSaveChangesClick);
  $('#bills').on('click', '.delete-bill', handleDeleteBillClick);
  $('#bills').on('click', '.cancel-edit', handleCancelEditClick);

  //catch and handle clicks in the filter by issues dropdown menu
  $('#issues').on('click', '.funding', filterBillsByFunding)
  $('#issues').on('click', '.vouchers', filterBillsByVouchers)
  $('#issues').on('click', '.affordability', filterBillsByAffordability)
  $('#issues').on('click', '.dept-of-ed', filterBillsByDeptOfEd)
  $('#issues').on('click', '.allbills', getAllBills)


  // save action items modal save button
  $('#saveActionItem').on('click', handleNewActionItemSubmit);
  $('#bill').on('click', '.edit-actionItem', handleEditActionItemsClick);

  // edit action items modal triggers
  $('#EditActionItemsModalBody').on('click', 'button.btn-danger', handleDeleteActionItemClick);
  $('#EditActionItemsModal').on('click', 'button#EditActionItemsSubmit', handleUpdateActionItemsSave);

  //click add bill button to get dropdown add bill form
  $(function(){
    $('legend').click(function(){
      $(this).nextAll('div').toggle("hidden");
    });
  });

  $('#bill-form').on('click', '.close-add-bill', handleCloseAddBillClick);
});
//End of Document Ready Function!


function handleUpdateActionItemsSave(event) {
  // build all the action items objects up
  var $modal = $('#EditActionItemsModal');
  if($modal.find('form').length < 1) {
    // if there are no form elements, then there are no action items to update
    $modal.modal('hide');
    return;
  }
  // snag the billId from the first form object on the modal
  var billId = $modal.find('form').data('bill-id');

  var updatedActionItems = [];
  // see https://api.jquery.com/each/
  $modal.find('form').each(function () {
    // in here this is a form element
    var anActionItem = {};
    anActionItem._id = $(this).attr('id');
    anActionItem.name = $(this).find('input.actionItem-title').val();
    anActionItem.trackNumber = $(this).find('input.actionItem-description').val();
    console.log('found updated data for actionItem: ', anActionItem);
    updatedactionItems.push(anActionItem);
  });
  // at this point we should have an array of actionItems to PUT to the server
  //   this is going to be a lot of requests and after all of them we have to update the page again
  //   maybe we should display a spinner to let the user know the requests are processing ?
  //   but let's just take the easy route - hide the modal and continue processing in the background
  $modal.modal('hide');
  updateMultipleActionItems(billId, updatedActionItems);
}

function updateMultipleActionItems(billId, actionItems) {
  // We're going to kick off as many PUT requests as we need - 1 per actionItemId
  // We'll keep track of the promises from each and once they are ALL done then
  //   we'll re-render the entire bill again.
  // We don't want to re-render BEFORE the PUT requests are complete because the data we fetch back
  //   might not have all the updates in it yet!
  var url = '/api/bills/' + billId + '/actionItems/';
  var deferreds = [];

  actionItems.forEach(function(actionItem) {
    var ajaxCall = $.ajax({
      method: 'PUT',
      url: url + actionItems._id,
      data: actionItem,
      error: function(err) { console.log('Error updating action item', actionItem.title, err); }
    });
    deferreds.push(ajaxCall);
  });

  // wait for all the deferreds then, refetch and re-render the bill
  // the .apply here is allowing us to apply the stuff in the promises array
  $.when.apply(null, deferreds).always(function() {
    console.log('all updates sent and received, time to refresh!');
    console.log(arguments);
    fetchAndReRenderBillWithId(billId);
  });
}

function fetchAndReRenderBillWithId(billId) {
  $.get('/api/bills/' + billId, function(data) {
    // remove the current instance of the bill from the page
    $('div[data-bill-id=' + billId + ']').remove();
    // re-render it with the new bill data (including actionItems)
    renderBill(data);
  });
}

// when a delete button in the edit actionItems modal is clicked
function handleDeleteActionItemClick(e) {
  e.preventDefault();  // this is a form!
  var $thisButton = $(this);
  var actionItemId = $thisButton.data('actionItem-id');
  var billId = $thisButton.closest('form').data('bill-id');

  var url = '/api/bills/' + billId + '/actionItems/' + actionItemId;
  console.log('send DELETE ', url);
  $.ajax({
    method: 'DELETE',
    url: url,
    success: handleactionItemDeleteResponse
  });
}

function handleactionItemDeleteResponse(data) {
  console.log('handleactionItemDeleteResponse got ', data);
  var actionItemId = data._id;
  var $formRow = $('form#' + actionItemId);
  // since billId isn't passed to this function, we'll deduce it from the page
  var billId = $formRow.data('bill-id');
  // remove that actionItem edit form from the page
  $formRow.remove();
  fetchAndReRenderBillWithId(billId);
}

// when edit actionItems button clicked
function handleEditActionItemsClick(e) {
  var $billRow = $(this).closest('.bill');
  var billId = $billRow.data('bill-id');
  console.log('edit actionItems clicked for ', billId);
  // seems we need the list of actionItems here - later, when you see full front-end
  // frameworks, this'll be a little easier, for now - lets request the data we need
  $.get('/api/bills/' + billId + "/actionItems", function(actionItems) {
    console.log('got back actionItems: ', actionItems);
    populateEditActionItemsModal(actionItems, billId);
    // fire zee modal!
    $('#editactionItemsModal').modal();
  });
}

function buildeditActionItemsForms(actionItems, billId) {
  // create a edit form for each actionItem, using the same billId for all of them
  var actionItemEditFormHtmlStrings = actionItems.map(function(actionItem){
    return (`
      <form class="form-inline" id="${actionItem._id}" data-bill-id="${billId}" >
        <div class="form-group">
          <input type="text" class="form-control actionItem-description" value="${actionItem.description}">
        </div>
        <div class="form-group">
          <input type="text" class="form-control actionItem-title" value="${actionItem.title}">
        </div>
        <div class="form-group">
          <button class="btn btn-danger" data-actionItem-id="${actionItem._id}">x</button>
        </div>
      </form>
    `);
  });

  return actionItemEditFormHtmlStrings.join(""); // combine all the forms into a single string
}

// takes an array of actionItems and generates an EDIT form for them
function populateEditActionItemsModal(actionItems, billId) {
  var EditActionItemsFormsHtml = buildEditActionItemsForms(actionItems, billId);
  // find the modal's body and replace it with the generated html
  $('#EditActionItemsModalBody').html(EditActionItemsFormsHtml);
}



function getBillsAndRender(params) {
  // remove existing html slash add loader
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

function renderActionItem(actionItem){
  return `<span>&ndash; <strong><p> ${actionItem.title} </p></strong> <p> ${actionItem.description}</p> <p> ${actionItem.dueDate} </p> &ndash;</span>`
}

// onsuccess function of POST which renders add bill form input to page
function renderBill(bill) {
  console.log('rendering bill', bill);

  bill.actionItemsHtml = bill.actionItems.map(renderActionItem).join("");

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
                    <h4 class='inline-header'>Issues:</h4>
                    <span class='bill-issues'>${bill.issues}</span>
                  </li>

                  <li class="list-group-item">
                  <h4 class="inline-header">Action Items:</h4>
                  ${bill.actionItemsHtml}
                </li>
                </ul>
              </div>
              <div class='col-md-2 text-center'>
                <div><button type='submit' class='btn btn-primary text-right
                edit-bill'>Edit</button></div> <br/>
                <div><button type='submit' class='btn btn-success save-bill
                hidden'>Save</button></div> <br/>
                <div><button type='submit' class='btn btn-danger delete-bill
                hidden'>Delete</button></div> <br/>
                <div><button type='submit' class='btn btn-default cancel-edit
                hidden'>Cancel</button></div> <br/>
                <div><button type='submit' class='btn btn-info text-right
                edit-actionItems hidden'>Edit Action Item</button></div><br/>
                <div><button type='submit' class='btn btn-primary text-right
                add-actionItem'>Add Action Item</button></div><br/>
              </div>
            </div>
            <!-- end of billinternal row -->
            <div class='panel-footer col-md-9 col-md-offset-1'>
              <div class='panel-footer action-items'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end one bill -->`);

  $('#bills').append(billHtml);
}

//handles the click on the Edit button of each bill, renders edit bill form
function handleBillEditClick(e){
    var $billRow = $(this).closest('.bill');
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

// after editing an bill, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var billId = $(this).closest('.bill').data('bill-id');
  var $billRow = $('[data-bill-id=' + billId + ']');
  var data = {
    title: $billRow.find('.edit-bill-title').val(),
    summary: $billRow.find('.edit-bill-summary').val(),
    sponsor: $billRow.find('.edit-bill-sponsor').val(),
    textUrl: $billRow.find('.edit-bill-text-url').val(),
    latestAction: $billRow.find('.edit-bill-latest-action').val()
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

// when a delete button for an bill is clicked
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
  console.log('add-actionItem clicked!');
  var currentBillId = $(this).closest('.bill').data('billid');
  console.log('id',currentbillId);
  $('#actionItemModal').data('bill-id', currentBillId);
  $('#actionItemModal').modal();  // display the modal
}

// when the action item modal submit button is clicked:
function handleNewActionItemSubmit(e) {
  e.preventDefault();
  var $modal = $('#actionItemModal');
  var $aITitleField = $modal.find('#actionItemTitle');
  var $aIDescriptionField = $modal.find('#actionItemDescription');
  var $aIDueDateField = $modal.find('#actionItemDueDate');

  // get data from modal fields
  // note the server expects the keys to be the action item attributes, so we use those.
  var dataToPost = {
    title: $aITitleField.val(),
    description: $$aIDescriptionField.val(),
    dueDate: $aIDueDateField.val()
  };
  var billId = $modal.data('billId');
  console.log('retrieved title:', title, ' description:', description, ' ane dud date:', dueDate, ' for bill with id: ', billId);
  // POST to SERVER
  var actionItemPostToServerUrl = '/api/bills/'+ billId + '/actionItems';
  $.post(actionItemToServerUrl, dataToPost, function(data) {
    console.log('received data from post to /actionItems:', data);
    // clear form
    $aITitleField.val(''),
    $aIDescriptionField.val(''),
    $aIDueDateField.val('')

    // close modal
    $modal.modal('hide');
    // update the correct bill to show new action item
    fetchAndReRenderBillWithId(billId);
  }).error(function(err) {
    console.log('post to /api/bills/:billId/actionItems resulted in error', err);
  });
}
