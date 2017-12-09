$(document).ready(function(){

    
    $('.up_to_form').on('click',function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('.start_screen .right_side').offset().top - 40
        }, 700);
    });


    $('#send_mail').on('click', function(e) {
        e.preventDefault();
        if ($('.start_screen .right_side form').find('input[name=name]').val() != "" && $('.start_screen .right_side form').find('input[name=phone]').val() != "" && $('.start_screen .right_side form').find('input[name=email]').val() != "") {
            $.ajax({
              url: $('.start_screen .right_side form').attr('action'),
              type: "POST",
              data: {
                name : $('.start_screen .right_side form').find('input[name=name]').val(),
                phone : $('.start_screen .right_side form').find('input[name=phone]').val(),
                email : $('.start_screen .right_side form').find('input[name=email]').val()
              },
              success: function() {
                    var success = $('.success_modal');
                    $(success).fadeIn();

                    $(success).find('.close_modal').on('click', function(e) {
                        e.preventDefault();
                        $(success).fadeOut();
                    });
                    $('.start_screen .right_side form input[name=name]').val("");
                    $('.start_screen .right_side form input[name=phone]').val("");
                    $('.start_screen .right_side form input[name=email]').val("");
              }
            });
        }
    });


    $('.open_modal').on('click', function(e) {
        e.preventDefault();
        var modal = $(this).attr('data-modal');
        $(modal).fadeIn();
        $(modal+'.modal_instruction').find('.modal').addClass('show_modal');
        $(modal+'.modal_description').find('.modal').addClass('show_modal-top');
        $(modal+'.baloon_desc').find('.modal').addClass('show_modal-left');

        $(modal).find('.close_modal').on('click', function(e) {
            e.preventDefault();
            $(modal).fadeOut();
            $(modal+'.modal_instruction').find('.modal').removeClass('show_modal');
               $(modal+'.modal_description').find('.modal').removeClass('show_modal-top');
               $(modal+'.baloon_desc').find('.modal').removeClass('show_modal-left');
        });

        $(modal).click(function(){
           $(modal+'.modal_instruction').find('.modal').removeClass('show_modal');
           $(modal+'.modal_description').find('.modal').removeClass('show_modal-top');
           $(modal+'.baloon_desc').find('.modal').removeClass('show_modal-left');
           $(modal).fadeOut();
        }).find('.modal').click(function(e){        // вешаем на потомков
            e.stopPropagation();   // предотвращаем всплытие
        });
    });   


});