from django.conf.urls import include, patterns, url

#handler404 =
#handler500 =
#handler403 =

urlpatterns = patterns(
    '',
    url(r'^', include('toforest.webapp.urls', namespace='webapp')),
)
