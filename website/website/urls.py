from django.conf.urls import patterns, include, url
import views

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^/*', include('mobile.urls')),
    # url(r'^/accounts/login$', views.login),
    (r'^accounts/login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}),
    url(r'^accounts/logout/$', 'django.contrib.auth.views.logout',
        {'next_page': '/home/'}, name='auth_logout'),
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
