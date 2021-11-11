
var modalInfo = document.getElementById("modal-info-order");



$('.detail-order').each(function () {
  var $this = $(this);
  var modalInfo1 = $this.parent().find('.modal');
  var CloseModal = $this.parent().find('.close-footer-info');
  
  $this.on('click',function(){
    modalInfo1.css("display","block"); 
  })
  CloseModal.on('click',function(){
    modalInfo1.css("display","none"); 
  })
})
  