# -*- coding: utf-8 -*-
import os
import time
import random
import requests
import json
from django.core.management.base import BaseCommand
from django.db.models.loading import get_model
from django.utils.text import slugify


NatureKind = get_model('webapp.NatureKind')
Region = get_model('webapp.Region')
ObjectType = get_model('webapp.ObjectType')


class Command(BaseCommand):
    args = ''
    help = 'load data from opendata sources'

    def handle(self, *args, **options):
        '''
        # Parks
        url_parks = 'https://opendata.mkrf.ru/opendata/7705851331-parks/data-16-structure-2.json?e={%22attachment%22:true}'
        response = requests.get(url_parks)
        park_objects = response.json()
        count = 0
        for obj in iter(park_objects):
            obj_general = obj.get('data').get('general')
            title = obj_general.get('name')
            description = obj_general.get('description')
            address_info = obj_general.get('address')
            address = address_info.get('street')
            geo_x, geo_y = None, None
            coords = address_info.get('mapPosition').get('coordinates')
            if coords:
                geo_x, geo_y = coords[0], coords[1]
            type_name = obj_general.get('category').get('name')
            type_slug = obj_general.get('category').get('sysName')
            region_name = obj_general.get('locale').get('name')
            region_slug = obj_general.get('locale').get('sysName')
            image_url = obj_general.get('image').get('url')

            region, created_reg = Region.objects.get_or_create(slug=region_slug, title=region_name)
            type, created_type = ObjectType.objects.get_or_create(slug=type_slug, defaults={'title': type_name})
            nature, created = NatureKind.objects.get_or_create(title=title,
                                                               defaults={'description': description, 'address': address,
                                                                         'image_url': image_url, 'region': region,
                                                                         'type': type, 'geo_x': geo_x, 'geo_y': geo_y})
            if created:
                count += 1
        self.stdout.write(u'SUCCESS: Park objects load. Count %d' % count)

        # Parks #2
        url_geocoder = 'https://geocode-maps.yandex.ru/1.x/?format=json&results=1&geocode='
        url_parks = 'https://opendata.mkrf.ru/opendata/7705851331-stat_parks/data-2-structure-1.json?e={%22attachment%22:true}'
        response = requests.get(url_parks)
        park_objects = response.json()
        count = 0
        for obj in iter(park_objects):
            data = obj.get('data')
            address = data.get('address')
            territory = data.get('territotory', '')
            address_geocoder = ' '.join([territory, address])
            title = data.get('fullname')

            coords = requests.get(url_geocoder + address_geocoder)
            coords = coords.json().get('response').get('GeoObjectCollection').get('featureMember')[0].get('GeoObject').get('Point').get('pos')
            time.sleep(0.1)
            geo_x = coords.split(' ')[1]
            geo_y = coords.split(' ')[0]

            region, created_reg = Region.objects.get_or_create(slug=slugify(territory), title=territory)
            type, created_type = ObjectType.objects.get_or_create(slug='parki', title=u'Парки')
            nature, created = NatureKind.objects.get_or_create(title=title,
                                                               defaults={'description': '', 'address': address,
                                                                         'image_url': '', 'region': region,
                                                                         'type': type, 'geo_x': geo_x, 'geo_y': geo_y})
            if created:
                count += 1
        self.stdout.write(u'SUCCESS: Park #2 objects load. Count %d' % count)
        '''

        # All other data
        url_objects = 'http://opendata.mkrf.ru/opendata/7705851331-egrkn/data-13-structure-2.json'
        response = requests.get(url_objects)
        all_objects = response.json()
        count = 0
        for obj in iter(all_objects):
            print 'data --------- ' + str(obj.keys())

            count += 1
            break

