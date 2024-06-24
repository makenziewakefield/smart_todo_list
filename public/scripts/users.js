// Client facing scripts here
$(() => {
  $('#add-item-form').submit((e) => {
    e.preventDefault();
    const userId = $('#item-submit-button').data('user-id');
    $.ajax({
      method: 'POST',
      url: `/users/${userId}/create`,
      data: $('#add-item-form').serialize()
    })
    .done((response) => {
      console.log('*************  item received from the post req: ', response)
      const $filmsUl = $('#films-items');
      const $restaurantsUL = $('#restaurants-items');
      const $booksUl = $('#books-items');
      const $toBuyUl = $('#to-buy-items');

      const $newItem = $(`<li class="list-items incomp-items" data-item-id="${response.id}">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
        <label class="form-check-label" for="inlineCheckbox1">${response.title}</label>
      </div>
      <div class="action-buttons">
        <button class="btn-delete btn-delete-${response.id}" data-item-id="${response.id}"><i class="fa-regular fa-trash-can"></i></button>
      </div>
    </li>`);

    if (response.category_id === 1) {
      $newItem.appendTo($filmsUl);
    } else if (response.category_id === 2) {
      $newItem.appendTo($restaurantsUL);
    } else if (response.category_id === 3) {
      // $(`<li class="incomp-items">`).text(response.title).appendTo($booksUl);
      $newItem.appendTo($booksUl);
    } else if (response.category_id === 4) {
      $newItem.appendTo($toBuyUl);
    }

    // Reset the form fields
    $('#add-item-form')[0].reset();

    })
    .fail(( xhr, status, errorThrown ) => {
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.log( xhr );
    });
  });

  $('.btn-delete').on('click', function (e) {
    // const itemId = $('.btn-delete-item').data('item-id');
    e.preventDefault();

    const itemId = $(this).data('item-id');

    console.log('item id from the button data', itemId);
    $.ajax({
      method: 'POST',
      url: `/users/${itemId}/delete`
    })
    .done(() => {
    // Handle success
    // alert('Item deleted successfully');
    $(`li[data-item-id="${itemId}"]`).remove();

    });
  });
});
