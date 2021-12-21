var modal = document.getElementById('myModal');
var modalAdd= document.querySelector('.modal-add');
var btn = document.getElementById("myBtn");
var span = document.querySelector(".closeBtn");
    // btn.onclick = function () {
    //     modal.style.display = "block";
    // }
    span.onclick = function () {
        modal.style.display = "none";
        // $('.alertAdd').html(null);
        // $('.alertEdit').html(null);
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        else if (event.modalAdd == modal){

        }
        $('.alertEdit').html(null);
        $('.alertAdd').html(null);
    }
    var dateAdd=$('.dateAdd');
    var nameEN= $('.nameEN');
    var date= $('.date');
    var time= $('.time');
    var room = $('.room');
    var formEdit=$('.formEdit')
    var tdName;
    var tdTime;
    var tdRoom;
    var tdDate;
    $(".filmSelect").change(function(e){
      var href= $(".filmSelect option:selected").attr('href');
      $(location).attr('href',href);
    })
  //   $(".filmSelect").change(function(e){
  //     var $this=$(this);
  //     var name=$this.val();
  //     $.ajax({
  //       url: "/admin/showtime/load-bynameEN",
  //       method: "POST",
  //       contentType: "application/json",
  //       data: JSON.stringify({ nameEN: name }),
  //       success: function (result) {
  //           $('#containTr').html(result.htmlCode);
  //           //nua sua sau khi select
  //           $('.editBtn').each(function () {
  //             var $this = $(this);
  //             var id = $this.attr('id');
  //             $this.on('click',function(){
  //                tdName = $this.closest('.trClosest').find('.tdName');
  //                tdTime = $this.closest('.trClosest').find('.tdTime');
  //                tdRoom = $this.closest('.trClosest').find('.tdRoom');
  //                tdDate = $this.closest('.trClosest').find('.tdDate');
  //               $.ajax({
  //                 url: "/admin/showtime/editBtn",
  //                 method: "POST",
  //                 contentType: "application/json",
  //                 data: JSON.stringify({ id: id }),
  //                 success: function (result1) {
  //                     nameEN.text(result1.nameEN);
  //                     date.val(result1.date);
  //                     time.html(result1.time);
  //                     room.html(result1.room);
  //                     formEdit.attr('id',id);
  //                     modal.style.display = "block";
  //                 }
  //             })
  //           })
            
  //           })
  //           //nut xoa sau khi select
  //           $('a.confirmDeletion').on('click', function () {
  //             if (!confirm('Confirm Deletion ? '))
  //                 return false;
  //           })
  //           $("#checkAll").change(function () {
  //             $(".form-check-input-del").prop('checked', $(this).prop("checked"));
  //             if ($('.itemcheck:checked').length>0){
  //                     $('.delete-all').prop('disabled',false);
  //                 } else $('.delete-all').prop('disabled',true);
  //             }); 
  //             $('.itemcheck').change(function(){
  //                 var isCheckAll = $('.itemcheck').length == $('.itemcheck:checked').length;
  //                 $('#checkAll').prop('checked',isCheckAll);
  //                 if ($('.itemcheck:checked').length>0){
  //                     $('.delete-all').prop('disabled',false);
  //                 } else $('.delete-all').prop('disabled',true);
  //             })
  //             $('.delete-all').click(function(){
  //               if (confirm('Bạn chắc chắn xóa ?')){
  //                   $('.formDeleteAll').submit();
  //               }
  //               e.preventDefault();
  //             })
  //         //nut switch sau khi select
  //           $('.swclosed').each(function(){
  //             var $this = $(this);
  //             var id = $this.attr('id');
  //             var i ;
  //             $this.change(function(){
  //               if ($this.is(':checked')) i=0;
  //               else i=1;
  //               $.ajax({
  //                 url: "/admin/showtime/editBlock",
  //                 method: "POST",
  //                 contentType: "application/json",
  //                 timeout: 10000,
  //                 data: JSON.stringify({ id: id, closed : i }),
  //                 success: function (result) {
  //                   if (result.noti!="") {
  //                     alert(result.noti);
  //                     $this.prop('checked',false);
  //                   }
  //                 }
  //               })
  //             })
              
  //           })
  //       }
  //   })
  // })
    $('.editBtn').each(function () {
        var $this = $(this);
        var id = $this.attr('id');
        $this.on('click',function(){
           tdName = $this.closest('.trClosest').find('.tdName');
           tdTime = $this.closest('.trClosest').find('.tdTime');
           tdRoom = $this.closest('.trClosest').find('.tdRoom');
           tdDate = $this.closest('.trClosest').find('.tdDate');
          $.ajax({
            url: "/admin/showtime/editBtn",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ id: id }),
            success: function (result) {
                nameEN.text(result.nameEN);
                date.val(result.date);
                time.html(result.time);
                room.html(result.room);
                formEdit.attr('id',id);
                modal.style.display = "block";
            }
        })
      })
      
      })
      
      $('#btn-save-change-item').on('click',function(e){
        var check=true;
        $('.span-error-edit').each(function(){
          if ($(this).text()!="") check=false;
        })
        if (check==true){
          var formm=formEdit[0];
          var id= formEdit.attr('id');
          var data = new FormData(formm);
          $.ajax({
            url: "/admin/showtime/edit-showtime/"+id,
            type: "POST",
            enctype: "multipart/form-data",
            cache:false,
            processData: false,
            contentType: false,
            data: data,
            success: function (result) {
                  if ( result.noti != "") $('.alertEdit').text(result.noti) ;
                   else {
                     tdTime.text(time.val());
                     tdRoom.text("CINEMA "+room.val());
                     var newDateArr=date.val().split('-') 
                     var newDate=newDateArr[2]+'/'+newDateArr[1]+'/'+newDateArr[0]; 
                     tdDate.text(newDate);   
                     modal.style.display = "none";
                   }
              }
          });
        } 
        e.preventDefault();
      }) 
 
$('.swclosed').each(function(){
  var $this = $(this);
  var id = $this.attr('id');
  var i ;
  $this.change(function(){
    if ($this.is(':checked')) i=0;
    else i=1;
    $.ajax({
      url: "/admin/showtime/editBlock",
      method: "POST",
      contentType: "application/json",
      timeout: 10000,
      data: JSON.stringify({ id: id, closed : i }),
      success: function (result) {
        if (result.noti!="") {
          alert(result.noti);
          $this.prop('checked',false);
        }
      }
    })
  })
  
})