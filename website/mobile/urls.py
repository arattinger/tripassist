from django.conf.urls import patterns, url

import views

urlpatterns = patterns(
    '',
    url(r'^$', views.mobile, name='mobile'),
    url(r'^manifest/$', views.manifest),
    url(r'^download/(?P<filename>.*)$', views.download),
)
