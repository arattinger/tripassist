from django.conf.urls import patterns, url

import views

urlpatterns = patterns(
    '',
    url(r'^$', views.mobile, name='mobile'),
    url(r'^home/$', views.home, name='home'),
    url(r'^holiday/(?P<holiday>.*)/route/(?P<route>.*)$',
        views.route, name='route'),
    url(r'^holiday/(?P<holiday>.*)/route/$', views.route, name='add_route'),
    url(r'^holiday/(?P<holiday>.*)/accommodation/(?P<accom>.*)$',
        views.accommodation, name='accommodation'),
    url(r'^holiday/(?P<holiday>.*)/accommodation/$',
        views.accommodation, name='add_accommodation'),
    url(r'^holiday/(?P<holiday>.*)/place/(?P<place>.*)$',
        views.place, name='place'),
    url(r'^holiday/(?P<holiday>.*)/place/$', views.place, name='add_place'),
    url(r'^holiday/$', views.holiday, name='holiday'),
    url(r'^holiday/(?P<holiday>.*)$', views.holiday_home, name='holiday_home'),
    url(r'^manifest/$', views.manifest),
    url(r'^manifest/cache.manifest$', views.cache_manifest),
    url(r'^download/(?P<filename>.*)$', views.download),

)
