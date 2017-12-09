
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
        var coords = [55.763951, 37.612728];      // тут нужно подставить координаты из какого-то сервиса



        console.log(url);

        var pointBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="map-balloon">' + 'ЗАГОЛОВОК' + '</div>',
            {}
        );

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

        /* РАСКОММЕНТИТЬ ДЛЯ ОТРИСОВКИ BACKEND-ДАННЫХ */
        /*
        $.get(url, {}, function(json){
            var points = [];
            var json_point, point, pointBalloonLayout;
            var yapoints = new ymaps.GeoObjectCollection({}, {preset: "islands#redCircleIcon", strokeWidth: 4, geodesic: true});
            var objects = $.parseJSON(json);
            $(objects).each(function(){
                json_point = $(this)[0];
                console.log(json_point['title']);
                pointBalloonLayout = ymaps.templateLayoutFactory.createClass(
                    '<div class="map-balloon">' + json_point['title'] + '</div>',
                    {}
                );

                point = new ymaps.Placemark(
                    [json_point['geo_x'], json_point['geo_y']],
                    {
                        name: json_point['title'],
                        preset: 'twirl#greenIcon',
                        balloonHeader: json_point['title'],
                        balloonContent: generateBalloonLayout(json_point['title']),  // идет в дефолтный балун кластера, и если не указан balloonContentLayout, то и туда идет это значение
                        balloonContentBody: generateBalloonLayout(json_point['description'])
                    },
                    {
                        // iconLayout: 'default#imageWithContent',                                 // метка с картинкой
                        iconColor: '#558507',     // цвет метки для кластера
                        // iconImageHref: data[i].sellers[0].manufacturer ? manufacturerImg : sellerImg,
                        // iconImageOffset: [-20, -50],     // Положение "ножки" значка
                        iconImageSize: [40, 53],         // Размер значка
                        balloonLayout: pointBalloonLayout,
                        // balloonOffset: [-20, -50]
                    }
                );
                yapoints.add(point);
            });

            map.geoObjects.add(yapoints);
        });
        */

    });


});

function generateBalloonLayout(mark) {
	var template = '<h5>' + mark['title'] + '<p>' + mark['description'] + '</p></h5>';
	return template;
}
