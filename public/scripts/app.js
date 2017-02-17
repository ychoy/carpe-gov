$(document).ready(function() {
  console.log('app.js loaded!');

  $.ajax({
    method: 'GET',
    url: '/api/bills',
    success: renderMultipleBills
  });

  $('#bill-form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/bills', formData, function(bill) {
      console.log('bill after POST', bill);
      renderBill(bill);  //render the server's response
    });
    $(this).trigger("reset");
  });

  //catch and handle click on Edit and Delete Bill buttons
  $('#bills').on('click', '.edit-bill', handleBillEditClick);
  $('#bills').on('click', '.save-bill', handleSaveChangesClick);
// work on later $('#bills').on('click', '.delete-bill', handleDeleteBillClick);
  $(function(){
    $('legend').click(function(){
      $(this).nextAll('div').toggle('hidden');
    });
  });
});


function renderMultipleBills(bills) {
  bills.forEach(function(bill) {
    renderBill(bill);
  });
}

function renderBill(bill) {
  console.log('rendering bill', bill);

  var billHtml = (`
    <div class="row bill" data-bill-id="${bill._id}">
      <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
          <div class="panel-body">
          <!-- begin bill internal row -->
            <div class='row'>
              <div class="col-md-10 col-md-offset-1">
                <ul class="list-group">
                  <li class="list-group-item">
                    <h4 class='inline-header'>Bill Title:</h4>
                    <span class='bill-title'>${bill.title} </span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Summary:</h4>
                    <span class='bill-summary'>${bill.summary}</span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Sponsor:</h4>
                    <span class='bill-sponsor'>${bill.sponsor}</span>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header bill-text-url'>Text:<a href=${bill.textUrl}>Read Text</a></h4>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Latest Action:</h4>
                    <span class='bill-latest-action'>${bill.latestAction}</span>
                  </li>
                </ul>

              </div>
            </div>
            <!-- end of billinternal row -->
            <div class='panel-footer col-md-10 col-md-offset-1'>
              <div class='panel-footer'>
                <button class='btn btn-primary add-bill'>Add Bill</button>
                <button type="submit" class="btn btn-info text-right edit-bill">Edit</button>
                <button class='btn btn-danger delete-bill hidden'>Delete Bill</button>
                <button class='btn btn-success save-bill hidden'>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end one bill -->
  `);
  $('#bills').prepend(billHtml);
}

function handleBillEditClick(e){
    var $billRow = $(this).closest('.bill');
    var billId = $billRow.data('bill-id');
    console.log('edit bill', billId);

    // show the save changes button
    $billRow.find('.save-bill').toggleClass('hidden');
    // hide the edit button
    $billRow.find('.edit-bill').toggleClass('hidden');

    // get the bill title and replace its field with an input element
    var billTitle = $billRow.find('span.bill-title').text();
    $billRow.find('span.bill-title').html('<input class="edit-bill-title" value="' + billTitle + '"></input>');

    // get the bill summary and replace its field with an input element
    var billSummary = $billRow.find('span.bill-summary').text();
    $billRow.find('span.bill-summary').html('<input class="edit-bill-summary" value="' + billSummary + '"></input>');

    // get the bill sponsor and replace its field with an input element
    var billSponsor = $billRow.find('span.bill-sponsor').text();
    $billRow.find('span.bill-sponsor').html('<input class="edit-bill-sponsor" value="' + billSponsor + '"></input>');

    // get the bill text url and replace its field with an input element
    var billTextUrl = $billRow.find('span.bill-text-url').text();
    $billRow.find('span.bill-text-url').html('<input class="edit-bill-text-url" value="' + billTextUrl + '"></input>');

    // get the bill latest action and replace its field with an input element
    var billLatestAction = $billRow.find('span.bill-latest-action').text();
    $billRow.find('span.bill-latest-action').html('<input class="edit-bill-latest-action" value="' + billLatestAction + '"></input>');
}



// after editing an album, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var billId = $(this).closest('.bill').data('bill-id'); // $(this).closest would have worked fine too
  var $billRow = $('[data-bill-id=' + billId + ']');

  var data = {
    title: $billRow.find('.edit-bill-title').val(),
    summary: $billRow.find('.edit-bill-summary').val(),
    sponsor: $billRow.find('.edit-bill-sponsor').val(),
    textUrl: $billRow.find('.edit-bill-text-url').val(),
    latestAction: $billRow.find('.edit-bill-latest-action').val()
  };
  console.log('PUTing data for bill', billId, 'with data', data);

  $.ajax({
    method: 'PUT',
    url: '/api/bills/' + billId,
    data: data,
    success: handleBillUpdatedResponse
  });
}



//onsuccess function of put ajax call PUTing data for bill
function handleBillUpdatedResponse(data) {
  console.log('response to update', data);

  var billId = data._id;
  // scratch this bill from the page
  $('[data-bill-id=' + billId + ']').remove();
  // and then re-draw it with the updates
  renderBill(data);

  // BONUS: scroll the change into view
  //$('[data-bill-id=' + billId + ']')[0].scrollIntoView();
}
