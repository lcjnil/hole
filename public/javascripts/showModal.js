$('#emoji').click(function() {
  $('.small.modal').modal('show');
})

$('.emoji').click(function() {
  var messageInput = document.getElementById('area');
  messageInput.focus();
  messageInput.value = messageInput.value + '[emoji:' + $(this).attr('class').substr(11, $(this).attr('class').length-1) + ']';
  $('.small.modal').modal('hide');
})