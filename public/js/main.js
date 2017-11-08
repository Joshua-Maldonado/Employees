$(document).ready(func());

function func(){
  $('.delete-employee').on('click', function(){
    var id= $(this).data('id');
    var url = '/delete/'+id;
    if(confirm('Delete Employee?')){
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result){
          console.log('Deleting Recipe...');
          window.location.href='/';
        },
        error: function(err){
          console.log(err);
        }
      });
    }
  });



  $('.edit-employee').on('click', function(){
    $("#editFormModal").modal();
    $('#edit-form-firstname').val($(this).data('firstname'));
    $('#edit-form-lastname').val($(this).data('lastname'));
    $('#edit-form-age').val($(this).data('age'));
    $('#edit-form-sex').val($(this).data('sex'));
    $('#edit-form-id').val($(this).data('id'));
    $('#editFormModal').on('show.bs.modal', function() {
       $('#editFormModal').focus();
    });
  });
}
