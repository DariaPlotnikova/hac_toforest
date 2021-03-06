
$(document).ready(function(){
    ymaps.ready(function(){

        var map = window.map = new ymaps.Map('YMapsID', { center: [56.034, 36.992], zoom: 8, controls: [] });
        // удаляем лишние элементы управления с карты
        map.controls.remove('mapTools');
        map.controls.remove('trafficControl');
        map.controls.remove('searchControl');
        map.controls.remove('typeSelector');
        map.controls.remove('geolocationControl');
        map.controls.add('zoomControl');

        map.balloon.setOptions('autoPan', true);



        /*
        map.controls.add(
          new ymaps.control.Button({
            data: {
              content: "Моя кнопка"
            },
            options: {
              layout:
                ymaps.templateLayoutFactory.createClass(
                    template
                ),
              maxWidth: 80
            }})
        );
        */

        function drawBalloonContent(balloon){
            var rows = getRows();
            var objsInCluster = rows[0], objsCnt = rows[1], url = rows[2];
            var cluster = balloon.getData().cluster;
            if (cluster != undefined){
                cluster.options.set('balloonLayout', ymaps.templateLayoutFactory.createClass(
                    '<div class="map-balloon">\
                        <span href="#" class="map-balloon__close">&times;</span>\
                        <table class="map-balloon__table">\
                            <thead>\
                                <tr>\
                                    <th class="map-balloon__table-title map-balloon__table-title_name">Наименование</th>\
                                    <th class="map-balloon__table-title map-balloon__table-title_price">Цена</th>\
                                    <th class="map-balloon__table-title map-balloon__table-title_volume">Объем</th>\
                                    <th class="map-balloon__table-title map-balloon__table-title_seller">Поставщик</th>\
                                </tr>\
                            </thead>\
                            <tbody>'+objsInCluster+'</tbody>\
                        </table>\
                        <a href="/api/items/list/'+url+'" class="btn btn-primary map-balloon__gotocatalog">Все предложения <span class="count">('+objsCnt+')</span></a>\
                    </div>'
                ));
                cluster.options.set('balloonOffset', objsCnt == 2 ? [0, -80] : [0, -120]);
            }
        }

        // Создадим кластеризатор и запретим приближать карту при клике на кластеры.
        clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterIconLayout: 'default#pieChart',      // Макет метки кластера pieChart.
            clusterIconPieChartRadius: 22,              // Радиус диаграммы в пикселях.
            clusterIconPieChartCoreRadius: 15,          // Радиус центральной части макета.
            clusterIconPieChartStrokeWidth: 3           // Ширина линий-разделителей секторов и внешней обводки диаграммы.
            //balloonLayout: customBalloonContentLayout,
        });

        clusterer.events.add('click', function(){
            var balloon = map.balloon._balloon;
            if (balloon._state != 'CLOSED'){
                setTimeout(function(){  // при скрытии балуна кликом на другую метку (не на крестик), не успевает перестроить контент балуна под объявления в кластере
                    drawBalloonContent(balloon);
                }, 150);
            }
        });

        

        // при открытии балуна на кластере(!), нужно обновить контент
        // таблицы по меткам, которые входят в этот кластер
        map.events.add(['balloonopen'], function (e) {
            var balloon = map.balloon._balloon;
            if (balloon._state != 'CLOSED'){
                var cluster = balloon.getData().cluster;
                if (cluster != undefined){
                    drawBalloonContent(balloon);
                }
            }
        });

        // отрисовываем начальные точки на карте
        var url = $('#ajaxUrl').val();
        var coords = [55.763951, 37.612728];      // TODO тут нужно подставить координаты из какого-то сервиса
        var myPoint = new ymaps.Placemark(
            [coords[0], coords[1]],
            {
                preset: "twirl#blueStretchyIcon",
                fillColor: 'ff0000',
                strokeColor: 'ff0000',
                hintContent: 'Это Вы'
            },
            {
                iconColor: '#852d14',     // цвет метки для кластера
                iconImageSize: [40, 53]   // Размер значка
            }
        );
        map.geoObjects.add(myPoint);

        console.log(url);

        var pointBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '',
            {}
        );

        /*
        var testpoint = new ymaps.Placemark(
            [55.763951, 37.612728],
            {
                name: 'ЗАГОЛОВОК',
                preset: 'twirl#greenIcon',
                balloonHeader: 'ЗАГОЛОВОК',
                balloonContent: 'ЗАГОЛОВОК',  // идет в дефолтный балун кластера, и если не указан balloonContentLayout, то и туда идет это значение
                balloonContentBody: 'ЗАГОЛОВОК'
            },
            {
                // iconLayout: 'default#imageWithContent',                                 // метка с картинкой
                iconColor: '#558507',     // цвет метки для кластера
                // iconImageHref: data[i].sellers[0].manufacturer ? manufacturerImg : sellerImg,
                // iconImageOffset: [-20, -50],     // Положение "ножки" значка
                iconImageSize: [40, 53],         // Размер значка
                balloonLayout: pointBalloonLayout
                // balloonOffset: [-20, -50]
            }
        );
        map.geoObjects.add(testpoint);

        testpoint.events.add('click', function(){
            var modal = $('.baloon_desc');
            $('.baloon_desc').fadeIn().find('.modal').addClass('show_modal-left');
            $(modal).find('.close_modal').on('click', function(e) {
                e.preventDefault();
                $(modal).fadeOut();
                $(modal).find('.modal').removeClass('show_modal-left');
                testpoint.options.set('hasBalloon', false);
            });

            $(modal).click(function(){
               $(modal).find('.modal').removeClass('show_modal-left');
               $(modal).fadeOut();
               testpoint.options.set('hasBalloon', false);
            }).find('.modal').click(function(e){        // вешаем на потомков
                e.stopPropagation();   // предотвращаем всплытие
            });
            $(modal).find('.item_title .value').find('a').attr('href','https://www.google.ru/search?q=x'
            ).html('x');
            $(modal).find('.item_address .value').html('x');
            $(modal).find('.item_img .value img').attr('src', 'x');
            $(modal).find('.item_type .value').html('x');
            $(modal).find('.item_region .value').html('x');
            $(modal).find('.item_description .value').html('x');
        });
        */



        /* РАСКОММЕНТИТЬ ДЛЯ ОТРИСОВКИ BACKEND-ДАННЫХ */
        var wayUrl = $('#wayUrl').val();
        $.get(url, {}, function(json){
            var points = [];
            var json_point, point, pointBalloonLayout;
            var yapoints = new ymaps.GeoObjectCollection({}, {preset: "islands#redCircleIcon", strokeWidth: 4, geodesic: true});
            var objects = $.parseJSON(json);
            $(objects).each(function(){
                var json_point = $(this)[0];
                var wayUrlFull = wayUrl + '?point=' + json_point['pk'];
                console.log(wayUrlFull);

                point = new ymaps.Placemark(
                    [json_point['geo_x'], json_point['geo_y']],
                    {
                        preset: 'twirl#greenIcon',
                        hintContent: json_point['hint']
                        //balloonHeader: json_point['title'],
                        //balloonContent: generateBalloonLayout(json_point['title']),  // идет в дефолтный балун кластера, и если не указан balloonContentLayout, то и туда идет это значение
                        //balloonContentBody: generateBalloonLayout(json_point['description'])
                    },
                    {
                        // iconLayout: 'default#imageWithContent',                                 // метка с картинкой
                        iconColor: '#558507',     // цвет метки для кластера
                        // iconImageHref: data[i].sellers[0].manufacturer ? manufacturerImg : sellerImg,
                        // iconImageOffset: [-20, -50],     // Положение "ножки" значка
                        iconImageSize: [40, 53]         // Размер значка
                        //balloonLayout: pointBalloonLayout,
                        // balloonOffset: [-20, -50]
                    }
                );
                yapoints.add(point);
                point.events.add('click', function(){
                    var modal = $('.baloon_desc');
                    $('.baloon_desc').fadeIn().find('.modal').addClass('show_modal-left');
                    $(modal).find('.close_modal').on('click', function(e) {
                        e.preventDefault();
                        $(modal).fadeOut();
                        $(modal).find('.modal').removeClass('show_modal-left');
                        point.options.set('hasBalloon', false);
                    });

                    $(modal).click(function(){
                       $(modal).find('.modal').removeClass('show_modal-left');
                       $(modal).fadeOut();
                       point.options.set('hasBalloon', false);
                    }).find('.modal').click(function(e){        // вешаем на потомков
                        e.stopPropagation();   // предотвращаем всплытие
                    });
                    $(modal).find('.item_title .value').find('a').attr('href','https://www.google.ru/search?q='+json_point['title']).html(json_point['title']);
                    if (json_point['geo_x'] && json_point['geo_y']) {
                        $(modal).find('.item_address .value').find('a').attr('href', wayUrlFull).html(json_point['address']);
                    }
                    else {          // если координат нет, то делаем не кликабельной
                        $(modal).find('.item_address .value').find('a').attr('href', 'javascript:void(0);').html(json_point['address']);
                    }
                    $(modal).find('.item_img .value img').attr('src', json_point['image']);
                    $(modal).find('.item_type .value').html(json_point['type_name']);
                    $(modal).find('.item_region .value').html(json_point['region_name']);
                    $(modal).find('.item_description .value').html(json_point['description']);
                });
            });

            map.geoObjects.add(yapoints);
        });


    });


});

function generateBalloonLayout(mark) {
	var template = '<h5>' + mark['title'] + '<p>' + mark['description'] + '</p></h5>';
	return template;
}


