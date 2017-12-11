$(document).ready(function(){
    var url = $('#ajaxUrl').val();
    $('#select_city').on('change', function(){
        var regionId = $(this).val();
        $.get(url, {region_id: regionId}, function(json){
            // TODO удалять старые метки с карты и выводить новые, отсфильтрованные по региону
            console.log(json);
        });
    });
});