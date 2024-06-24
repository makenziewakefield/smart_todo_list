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
    alert('Item deleted successfully');
    $(`li[data-item-id="${itemId}"]`).remove();

    });
  });
});

$(document).ready(function() {
  $('#add-item-form').off('submit').on('submit', function(event) {
    event.preventDefault();

    const newItem = $('#new-item').val();
    const userId = $('#item-submit-button').data('user-id');

    console.log(`UserID: ${userId}, NewItem: ${newItem}`);

    function addItemToServer() {
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'POST',
          url: `/${userId}`,
          data: JSON.stringify({ 'new-item': newItem }),
          contentType: 'application/json', // Ensure correct JSON MIME type
          success: function(response) {
            resolve(response);
          },
          error: function(xhr) {
            reject(xhr);
          }
        });
      });
    }

    addItemToServer()
      .then(response => {
        console.log("Server response:", response);
        alert('Item added successfully!');
        location.reload();
      })
      .catch(xhr => {
        console.error("Error status:", xhr.status);
        console.error("Response:", xhr.responseText);

        if (xhr.status === 400) {
          alert(xhr.responseJSON ? xhr.responseJSON.error : 'Bad Request Error');
        } else if (xhr.status === 500) {
          alert('Server Error. Please try again later.');
        } else {
          alert('An unexpected error occurred.');
        }
      });
  });
});