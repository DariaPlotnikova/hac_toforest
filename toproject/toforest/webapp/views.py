# _*_ coding: utf-8 _*_
from django import http
import requests
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import Context, loader
from django.db.models import Q
from django.shortcuts import get_object_or_404, render_to_response
from django.conf import settings

from . import models, defaults, forms


def index(request):
    template_name = 'toforest/index.html'
    return render_to_response(template_name, {})
