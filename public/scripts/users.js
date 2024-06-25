// Client facing scripts here
$(() => {
  $('#add-item-form').submit((e) => {
    e.preventDefault();
    const userId = $('#item-submit-button').data('user-id');
    const serializedData = $('#add-item-form').serialize();

    const submitItem = (data, forceCategory = false) => {
      if (forceCategory) {
        data += '&force_category=4';
      }

      $.ajax({
        method: 'POST',
        url: `/users/${userId}/create`,
        data: data
      })
      .done((response) => {
        console.log('*************  item received from the post req: ', response);
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
          $newItem.appendTo($booksUl);
        } else if (response.category_id === 4) {
          $newItem.appendTo($toBuyUl);
        }

        // Reset the form fields
        $('#add-item-form')[0].reset();
      })
      .fail((xhr, status, errorThrown) => {
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.log(xhr);

        if (xhr.responseJSON && xhr.responseJSON.error === 'This is not an item.') {
          if (confirm('This item cannot be categorized. Do you want to push it anyways?')) {
            submitItem(serializedData, true); // Resubmit with force category
          }
        } else {
          alert('An error occurred. Please try again.');
        }
      });
    };

    submitItem(serializedData);
  });

  $('.btn-delete').on('click', function (e) {
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
      success: function(response) {
        console.log('Item status updated:', response);
      },
      error: function (err) {
        console.log('Error updating item completion status (scripts):', err);
      }
    });
  });


  $('#submit-button').click(function(event) {
    event.preventDefault();
    const newItem = $('#new-item-input').val();
    const userId = $('#user-id-input').val();
    $.ajax({
      url: `/${userId}/create`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ 'new-item': newItem }),
      success: function(response) {
        console.log('Item created:', response);
        alert('Item successfully created.');
      },
      error: function(xhr, status, error) {
        if (xhr.status === 400) {
          if (confirm('This item cannot be categorized. Do you want to push it anyways?')) {
            $.ajax({
              url: `/${userId}/create`,
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ 'new-item': newItem, 'force_category': 4 }),
              success: function(response) {
                console.log('Item created with force category:', response);
                alert('Item successfully created.');
              },
              error: function(xhr, status, error) {
                alert('An error occurred. Please try again.');
              }
            });
          }
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    });
  });
});
