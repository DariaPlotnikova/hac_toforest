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
from .management.commands.load_nature_objects import load_parks, load_parks2


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


def draw_way(request):
    template_name = 'toforest/way.html'
    pk = request.GET.get('point')
    obj = get_object_or_404(models.NatureKind, pk=pk)
    return render_to_response(template_name, {'obj': obj})


def get_points(request):
    region_pk = request.GET.get('region_id')
    objects = models.NatureKind.objects.filter(region__pk=region_pk) if region_pk \
        else models.NatureKind.objects.all()
    json_data = json.dumps([o.to_json() for o in objects[:10]])
    print 'JSON ------------ ' + str(json_data)
    return JsonResponse(json_data, safe=False)


def load_points(request):
    passwd = request.GET.get('p')
    if passwd == settings.SECRET_LOAD:
        cnt = load_parks()
        cnt2 = load_parks2()
        total = models.NatureKind.objects.count()
        return JsonResponse({'count': cnt, 'count2': cnt2, 'total_count': total})
    else:
        raise Http404

