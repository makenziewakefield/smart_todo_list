// Client facing scripts here
$(() => {
  // Ajax call for ADDING an ITEM
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

    // Empty the form fields
    $('#add-item-form')[0].reset();

    })
    .fail(( xhr, status, errorThrown ) => {
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.log( xhr );
    });
  });

  // Ajax call for DELETING an ITEM
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
    })
    .fail(( xhr, status, errorThrown ) => {
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.log( xhr );
    });
  });

  // Handling the UPDATE button click
  $('.btn-update').on('click', function() {
    const itemId = $(this).data('item-id');
    console.log('//////item ID of the clicked update:  ', itemId)
    // console.log("btn data id: ", $(this[data-item-id="${itemId}"]) )

    // Check if the button is currently "Update" or "Cancel"
    if ($(`.btn-update-${itemId}`).text() === 'Update') {
      // Change button text to "Cancel"
      $(`.btn-update-${itemId}`).text('Cancel').addClass('btn-cancel').removeClass('btn-update');

      // Show the update form
      // $('#update-item-id').val(itemId);
      $(`.update-${itemId}-form`).slideDown();
    } else {
      // Change button text back to "Update"
      $(`.btn-update-${itemId}`).text('Update').addClass('btn-update').removeClass('btn-cancel');

      // Hide the update form
      $(`.update-${itemId}-form`).slideUp();
    }
  });

  // Handle update form submission
  $('#update-category-form').submit((e) => {
    e.preventDefault();
    const itemId = $('#update-item-id').val();
    const selectedCategory = $('input[name="category"]:checked').val();

    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }

    $.ajax({
      method: 'POST',
      url: `/items/${itemId}/update-category`,
      data: {
        category_id: selectedCategory
      },
      success: (response) => {
        console.log('Category updated successfully', response);

        // Optionally, update the UI to reflect the change
        // Hide the form and reset the button text after successful update
        $('#update-category-form').slideUp();
        $('.btn-cancel').text('Update').addClass('btn-update').removeClass('btn-cancel');
      },
      error: (xhr, status, errorThrown) => {
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.log(xhr);
      }
    });
  });

  // Optional: Handle form cancellation if the user clicks outside the form or other conditions
  $(document).on('click', (e) => {
    const $form = $('#update-category-form');
    if (!$form.is(e.target) && $form.has(e.target).length === 0 && !$(e.target).hasClass('btn-update')) {
      // Hide the form and reset the button text if clicked outside the form
      $form.slideUp();
      $('.btn-cancel').text('Update').addClass('btn-update').removeClass('btn-cancel');
    }
  });


});
