# -*- coding: utf-8 -*-
import os
import random
import requests
import json
from django.core.management.base import BaseCommand
from django.db.models.loading import get_model


NatureKind = get_model('webapp.NatureKind')
Region = get_model('webapp.Region')
ObjectType = get_model('webapp.ObjectType')


class Command(BaseCommand):
    args = ''
    help = 'load data from opendata sources'

    def handle(self, *args, **options):
        # Parks
        url_parks = 'https://opendata.mkrf.ru/opendata/7705851331-parks/data-16-structure-2.json?e={%22attachment%22:true}'
        response = requests.get(url_parks)
        park_objects = response.json()
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

            region, created_reg = Region.objects.get_or_create(slug=region_slug, defaults={'title': region_name})
            type, created_type = ObjectType.objects.get_or_create(slug=type_slug, defaults={'title': type_name})
            NatureKind.objects.create(title=title, description=description, address=address,
                                      image_url=image_url, region=region, type=type, geo_x=geo_x, geo_y=geo_y)
        self.stdout.write(u'SUCCESS: Park objects load')
