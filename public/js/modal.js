var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var span = document.querySelector(".closeBtn");
    // btn.onclick = function () {
    //     modal.style.display = "block";
    // }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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
      var $this=$(this);
      var name=$this.val();
      $.ajax({
        url: "/admin/showtime/load-bynameEN",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ nameEN: name }),
        success: function (result) {
            $('#containTr').html(result.htmlCode);
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
                  success: function (result1) {
                      nameEN.text(result1.nameEN);
                      date.val(result1.date);
                      time.html(result1.time);
                      room.html(result1.room);
                      formEdit.attr('id',id);
                      modal.style.display = "block";
                  }
              })
            })
            
            })
        }
    })
  })
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
                if ( result.noti != "") $('.alertFilm').text(result.noti) ;
                 else {
                   tdTime.text(time.val());
                   tdRoom.text("CINEMA "+room.val());
                   tdDate.text(date.val());   
                 }
            }
        });
        modal.style.display = "none";
        e.preventDefault();
      }) 
 
  