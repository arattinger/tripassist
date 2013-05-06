from django.conf.urls import patterns, url

import views

urlpatterns = patterns(
    '',
    url(r'^$', views.mobile, name='mobile'),
    url(r'^main/$', views.holiday, name='holiday'),
    url(r'^manifest/$', views.manifest),
    url(r'^manifest/cache.manifest$', views.cache_manifest),
    url(r'^download/(?P<filename>.*)$', views.download),

)
