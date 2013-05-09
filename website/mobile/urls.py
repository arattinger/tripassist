from django.conf.urls import patterns, url

import views

urlpatterns = patterns(
    '',
    url(r'^$', views.mobile, name='mobile'),
    url(r'^home/$', views.home, name='home'),
    url(r'^holiday/$', views.holiday, name='holiday'),
    url(r'^route/$', views.route, name='route'),
    url(r'^accommodation/$', views.accommodation, name='accommodation'),
    url(r'^place/$', views.place, name='place'),
    url(r'^manifest/$', views.manifest),
    url(r'^manifest/cache.manifest$', views.cache_manifest),
    url(r'^download/(?P<filename>.*)$', views.download),

)
