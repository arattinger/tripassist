from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.conf import settings
from os.path import join, basename
import mimetypes
from unicodedata import normalize
from django.http import HttpResponse
from models import Attachment, Holiday, Route, Accommodation, Place
from forms import HolidayForm, RouteForm, AccommodationForm, PlaceForm
import time
import re


def mobile(request):
    return render_to_response('mobile.html', {}, RequestContext(request))


@login_required
def home(request):
    referer = request.META.get('HTTP_REFERER')
    if referer:
        referer = re.sub('^https?:\/\/', '', referer).split('/')[1]
        if Holiday.__name__.lower() == referer:
            form = HolidayForm(request.POST)
        elif Route.__name__.lower() == referer:
            form = RouteForm(request.POST)
        elif Accommodation.__name__.lower() == referer:
            form = AccommodationForm(request.POST)
        elif Place.__name__.lower() == referer:
            form = PlaceForm(request.POST)
        print(referer)
        if form.is_valid():
            form.save()
        else:
            # TODO: Error handling!
            print("Error: not valid or missing input")
    return render_to_response('homepage.html', {}, RequestContext(request))


def holiday(request):
    form = HolidayForm()
    return render_to_response('holiday.html', {'form': form},
                              RequestContext(request))


def route(request):
    form = RouteForm()
    return render_to_response('route.html', {'form': form},
                              RequestContext(request))


def accommodation(request):
    form = AccommodationForm()
    return render_to_response('accommodation.html', {'form': form},
                              RequestContext(request))


def place(request):
    form = PlaceForm()
    return render_to_response('place.html', {'form': form},
                              RequestContext(request))


def manifest(request):
    data = {"username": request.user.username}
    return render_to_response('manifest.html', data, RequestContext(request))


@login_required
def cache_manifest(request):
    attachments = Attachment.objects.filter(user=request.user)
    data = {
        "attachments": attachments,
        "username": request.user.username,
        "timestamp": int(time.time()),
    }
    return render_to_response('cache.manifest', data, RequestContext(request))


def download(request, filename):
    # if not have_permissions(request, uuid):
    #     return HttpResponseForbidden()

    # for django in debug mode
    from django.core.servers.basehttp import FileWrapper
    from os.path import getsize

    resultfile = join(settings.MEDIA_ROOT, filename)
    wrapper = FileWrapper(open(resultfile))
    content_type = mimetypes.guess_type(resultfile)[0]

    # Remove Umlauts etc. from filename
    downloadname = basename(resultfile)
    downloadname = normalize("NFD", downloadname).encode("ascii", "ignore")

    if filename.endswith('.manifest'):
        content_type = "text/cache-manifest"

    response = HttpResponse(wrapper, content_type=content_type)
    response['Content-Length'] = getsize(resultfile)

    return response
