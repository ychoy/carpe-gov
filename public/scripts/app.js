$(document).ready(function() {
  console.log('app.js loaded!');

  $.ajax({
    method: 'GET',
    url: '/api/bills',
    success: renderMultipleBills
  });

  $('#bill-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/bills', formData, function(bill) {
      console.log('bill after POST', bill);
      renderBill(bill);  //render the server's response
    });
    $(this).trigger("reset");
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
    <div class="row album" data-album-id="${bill._id}">
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
                    <a href=<h4 class='inline-header'>Text:</h4>${bill.textUrl}>
                  </li>
                  <li class="list-group-item">
                    <h4 class='inline-header'>Latest Action:</h4>
                    <span class='bill-latestAction'>${bill.latestAction}</span>
                  </li>
                </ul>

              </div>
            </div>
            <!-- end of billinternal row -->
            <div class='panel-footer col-md-10 col-md-offset-1'>
              <div class='panel-footer'>
                <button class='btn btn-primary add-bill'>Add Bill</button>
                <button type="submit" class="btn btn-info text-right">Edit</button>
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
