# _*_ coding: utf-8 _*_
import requests
import json
from django import http
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.template import Context, loader
from django.db.models import Q
from django.shortcuts import get_object_or_404, render_to_response
from django.conf import settings


from . import models, defaults, forms


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def index(request):
    template_name = 'toforest/index.html'
    ip = get_client_ip(request)
    print 'IP ----- ' + str(ip)
    regions = models.Region.objects.all()
    types = models.ObjectType.objects.all()
    return render_to_response(template_name, {'regions': regions, 'types': types})


def get_points(request):
    region_pk = request.GET.get('region_id')
    objects = models.NatureKind.objects.filter(region__pk=region_pk) if region_pk \
        else models.NatureKind.objects.all()
    json_data = json.dumps([o.to_json() for o in objects])
    return JsonResponse(json_data, safe=False)

