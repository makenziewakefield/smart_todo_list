// Client facing scripts here
$(() => {
  $('#add-item-form').submit((e) => {
    e.preventDefault();
    const userId = $('#item-submit-button').data('user-id');
    $.ajax({
      method: 'POST',
      url: `/users/${userId}`,
      data: $('#add-item-form').serialize()
    })
    .done((response) => {
      response.forEach(item => {
        const $filmsUl = $('#films-items');
        const $restaurantsUL = $('#restaurants-items');
        const $booksUl = $('#books-items');
        const $toBuyUl = $('#to-buy-items');

      if (item.category_id === 1) {
        $(`<li class="incomp-items">`).text(item.title).appendTo($filmsUl);
      } else if (item.category_id === 2) {
        $(`<li class="incomp-items">`).text(item.title).appendTo($restaurantsUL);
      } else if (item.category_id === 3) {
        $(`<li class="incomp-items">`).text(item.title).appendTo($booksUl);
      } else if (item.category_id === 4) {
        $(`<li class="incomp-items">`).text(item.title).appendTo($toBuyUl);
      }
      });

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

  $('.todo-done').on('change', function (e) {
    e.preventDefault();

    const itemId = $(this).data('id');
    const isComplete = $(this).is(':checked');

    $.ajax({
      url: '/users/items/complete-status',
      method: 'POST',
      data: JSON.stringify({ itemId, isComplete }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(response){
        console.log('Item status updated:', response);
      },
      error: function (err) {
        console.log('Error updating item completion status (scripts):', err);
      }
    });
  });
});
