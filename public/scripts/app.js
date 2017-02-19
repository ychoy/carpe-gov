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

  //click add bill button to get dropdown add bill form
  $(function(){
    $('legend').click(function(){
      $(this).nextAll('div').toggle("hidden");
    });
  });

  $('#bill-form').on('click', '.close-add-bill', handleCloseAddBillClick);
});
//End of Document Ready Function!


// initial onsuccess function to GET all bills and render them to page
function renderMultipleBills(bills) {
  bills.forEach(function(bill) {
    renderBill(bill);
  });
}

// onsuccess function of POST which renders add bill form input to page
function renderBill(bill) {
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

// after editing an album, when the save changes button is clicked
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

// when a delete button for an album is clicked
function handleDeleteBillClick(e) {
  var billId = $(this).parents('.bill').data('bill-id');
  $.ajax({
    url: '/api/bills/' + billId,
    method: 'DELETE',
    success: handleDeleteBillSuccess
  });
}

// callback after DELETE /api/albums/:id
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
//  var filteredBills = .find("");
  filteredBills.forEach(function(fundingBill) {
    renderBill(fundingBill);
  });
}
//filters bills by vouchers issue in dropdown menu
function filterBillsByVouchers(e){
//  var filteredBills = .find("");
  filteredBills.forEach(function(voucherBill) {
    renderBill(voucherBill);
  });
}
//filters bills by affordability issue in dropdown menu
function filterBillsByAffordability(e){
//  var filteredBills = .find("");
  filteredBills.forEach(function(affordabilityBill) {
    renderBill(affordabilityBill);
  });
}
//filters bills by dept-of-ed issue in dropdown menu
function filterBillsByDeptOfEd(e){
//  var filteredBills = .find("");
  filteredBills.forEach(function(deptOfEdBill) {
    renderBill(deptOfEdBill);
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
