from django.conf.urls import patterns, url, include
from django.conf.urls.static import static
from django.conf import settings

admin_urls = patterns(
    'toforest.webapp.admin',
)

public_urls = patterns(
    'toforest.webapp.views',
    url(r'^$', 'index', name='index'),
    url(r'^get_points/$', 'get_points', name='get_points'),
    url(r'^load_points/$', 'load_points', name='load_points'),
    url(r'^draw_way/$', 'draw_way', name='draw_way'),
)


urlpatterns = patterns(
    'toforest.webapp.views',
    url(r'^', include(public_urls, namespace='public')),
    url(r'^admin/', include(admin_urls, namespace='admin')),
)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
