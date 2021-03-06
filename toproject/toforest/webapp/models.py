# _*_ coding: utf-8 _*_
from django.core.urlresolvers import reverse
from django.db import models
from django.db import connections
from django.core.cache import get_cache
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _
from django.db.models.loading import get_model
from django.conf import settings
from django.utils.html import strip_tags


class ObjectType(models.Model):
    title = models.CharField(max_length=128, blank=True, null=True)
    slug = models.CharField(max_length=128, blank=True, null=True)

    def __unicode__(self):
        return self.title

    class Meta:
        db_table = 'for_type'


class Region(models.Model):
    title = models.CharField(max_length=512, blank=True, null=True)
    slug = models.CharField(max_length=128, blank=True, null=True)

    def __unicode__(self):
        return self.title

    class Meta:
        db_table = 'for_region'


class NatureKind(models.Model):
    title = models.CharField(max_length=512, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    contact = models.CharField(max_length=512, blank=True, null=True)
    address = models.CharField(max_length=512, blank=True, null=True)
    geo_x = models.CharField(max_length=32, blank=True, null=True)
    geo_y = models.CharField(max_length=32, blank=True, null=True)
    type = models.ForeignKey(ObjectType, blank=True, null=True)
    region = models.ForeignKey(Region, blank=True, null=True)
    image_url = models.CharField(max_length=512, blank=True, null=True)

    def to_json(self):
        return {
            'pk': self.pk,
            'title': self.title,
            'description': strip_tags(self.description) if self.description else u'отсутствует',
            'contact': '',
            'address': self.address if self.address else u'не указан',
            'geo_x': self.geo_x,
            'geo_y': self.geo_y,
            'type': self.type.pk,
            'type_name': self.type.title if self.type.title else u'не указан',
            'region': self.region.pk,
            'region_name': self.region.title if self.type.title else u'не указан',
            'image': self.image_url
        }

    def __unicode__(self):
        return self.title

    class Meta:
        db_table = 'for_nature'
