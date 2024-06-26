// Client facing scripts here
$(() => {
  $(document).on('submit','#add-item-form', (e) => {
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
        let $compStatus = 'unchecked';
          if (response.is_complete === true) {
            $compStatus = 'checked';
          }
        const $newItem = $(`<li class="list-items incomp-items" data-item-id="${response.id}">
          <div class="form-check form-check-inline">
          <input type="checkbox" class="form-check-input todo-done" id="inlineCheckbox${response.id}" data-id="${response.id}" ${$compStatus} >
          <label class="form-check-label" for="inlineCheckbox1">${response.title}</label>
          </div>
          <div class="action-buttons">
          <button class="btn-update btn-update-${response.id}" data-item-id="${response.id}">Update</button>
            <button class="btn-delete btn-delete-${response.id}" data-item-id="${response.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </li>
        <form class="update-category-form update-${response.id}-form" style="display: none;" method="post" data-item-id="${response.id}">
        <p>Update Category:</p>
        <input type="hidden" id="update-item-id" name="item_id" value="">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="category" id="category1" value="1">
          <label class="form-check-label" for="category1">Films/Series</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="category" id="category2" value="2">
          <label class="form-check-label" for="category2">Restaurants</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="category" id="category3" value="3">
          <label class="form-check-label" for="category3">Books</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="category" id="category4" value="4">
          <label class="form-check-label" for="category4">To Buy</label>
        </div>
        <button type="submit">Update</button>
      </form>`);

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

  $(document).on('click', '.btn-delete', function(e) {
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

  $(document).on('change','.todo-done', function(e) {
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

  //***************************************************************************************** */
  // Ajax call for UPDATING an ITEM
  //***************************************************************************************** */
    // Handle update button click
    $(document).on('click', '.btn-update, .btn-cancel', function() {
      const itemId = $(this).data('item-id');
      $(`.update-${itemId}-form`).slideDown();

      // Check if the button is currently "Update" or "Cancel"
      if ($(`.btn-update-${itemId}`).text() === 'Update') {
        $(`.btn-update-${itemId}`).text('Cancel').addClass('btn-cancel').removeClass('btn-update');
        $(`.update-${itemId}-form`).slideDown();
      } else {
        $(this).text('Update').addClass('btn-update').removeClass('btn-cancel').addClass('btn-update');
        $(`.update-${itemId}-form`).slideUp();
      }
    });

    // Handle update form submission
    $(document).on('submit', '.update-category-form', function(e) {
      e.preventDefault();
      const itemId = $(this).data('item-id');
      // const itemId = $(e.target).find('.update-item-id').val();
      const selectedCategory = $(e.target).find('input[name="category"]:checked').val();
      console.log('ITEM ID && Selevted Category: ', itemId, selectedCategory);
      if (!selectedCategory) {
        alert('Please select a category.');
        return;
      }

      $.ajax({
        method: 'POST',
        url: `/users/${itemId}/update-category`,
        data: {
          category_id: selectedCategory
        },
        success: (response) => {
          console.log('Updated RETURNED ITEM category from backend', response[0].category_id);
          const $filmsUl = $('#films-items');
          const $restaurantsUL = $('#restaurants-items');
          const $booksUl = $('#books-items');
          const $toBuyUl = $('#to-buy-items');
          let $compStatus = 'unchecked';
          console.log('STATUS of th eresponse: ', response[0].is_complete);
          if (response[0].is_complete === true) {
            console.log('STATUS is true: ', response[0].is_complete);
            $compStatus = 'checked';
          }
          const $newItem = $(`<li class="list-items incomp-items" data-item-id="${response[0].id}">
          <div class="form-check form-check-inline">
          <input type="checkbox" class="form-check-input todo-done" id="inlineCheckbox${response[0].id}" data-id="${response[0].id}" ${$compStatus} >
          <label class="form-check-label" for="inlineCheckbox1">${response[0].title}</label>
          </div>
          <div class="action-buttons">
            <button class="btn-update btn-update-${response[0].id}" data-item-id="${response[0].id}">Update</button>
            <button class="btn-delete btn-delete-${response[0].id}" data-item-id="${response[0].id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </li>
        <form class="update-category-form update-${response[0].id}-form" style="display: none;" method="post" data-item-id="${response[0].id}">
            <p>Update Category:</p>
            <input type="hidden" id="update-item-id" name="item_id" value="">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="category" id="category1" value="1">
              <label class="form-check-label" for="category1">Films/Series</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="category" id="category2" value="2">
              <label class="form-check-label" for="category2">Restaurants</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="category" id="category3" value="3">
              <label class="form-check-label" for="category3">Books</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="category" id="category4" value="4">
              <label class="form-check-label" for="category4">To Buy</label>
            </div>
            <button type="submit">Update</button>
          </form>`);

        $(`li[data-item-id="${itemId}"]`).remove();

        if (response[0].category_id === 1) {
          $newItem.appendTo($filmsUl);
        } else if (response[0].category_id === 2) {
          $newItem.appendTo($restaurantsUL);
        } else if (response[0].category_id === 3) {
          // $(`<li class="incomp-items">`).text(response.title).appendTo($booksUl);
          $newItem.appendTo($booksUl);
        } else if (response[0].category_id === 4) {
          $newItem.appendTo($toBuyUl);
        }
          // console.log('item id : ', itemId);
          // Optionally, update the UI to reflect the change
          // Hide the form and reset the button text after successful update
          $(`.update-${itemId}-form`).slideUp();
          $(this).text('Update').addClass('btn-update').removeClass('btn-cancel');
        },
        error: (xhr, status, errorThrown) => {
          console.log("Error: " + errorThrown);
          console.log("Status: " + status);
          console.log(xhr);
        }
      });
    });

    $(document).on('click', function(e) {
      const $form = $('#update-category-form');
      if (!$form.is(e.target) && $form.has(e.target).length === 0 && !$(e.target).closest('.btn-update, .btn-cancel').length) {
        // Hide the form and reset the button text if clicked outside the form
        $form.slideUp();
        $('.btn-cancel').text('Update').addClass('btn-update').removeClass('btn-cancel');
      }
    });

});
