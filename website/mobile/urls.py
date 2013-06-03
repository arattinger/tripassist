from django.conf.urls import patterns, url

import views

urlpatterns = patterns(
    '',
    url(r'^$', views.mobile, name='mobile'),
    url(r'^holiday/$', views.home, name='home'),
    url(r'^holiday/add/$', views.holiday, name='add_holiday'),
    url(r'^holiday/(?P<holiday_id>\d+)/$', views.holiday_home, name='holiday_home'),
    url(r'^holiday/(?P<holiday_id>\d+)/route/(?P<item_id>\d+)/$',
        views.route, name='route'),
    url(r'^holiday/(?P<holiday_id>\d+)/route/add/$', views.route, name='route'),
    url(r'^holiday/(?P<holiday_id>\d+)/accommodation/(?P<item_id>\d+)/$',
        views.accommodation, name='accommodation'),
    url(r'^holiday/(?P<holiday_id>\d+)/accommodation/add/$',
        views.accommodation, name='accommodation'),
    url(r'^holiday/(?P<holiday_id>\d+)/place/(?P<item_id>\d+)/$',
        views.place, name='place'),
    url(r'^holiday/(?P<holiday_id>\d+)/place/add/$', views.place, name='place'),
    url(r'^manifest/$', views.manifest),
    url(r'^manifest/cache.manifest$', views.cache_manifest),
    url(r'^holidays.json$', views.get_serialized_holiday),
    url(r'^holidays_(?P<holiday_id>.*).json$', views.get_serialized_holiday),
)
