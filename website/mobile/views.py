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


def mobile(request):
    return render_to_response('mobile.html', {}, RequestContext(request))


@login_required
def home(request):
    holiday_list = Holiday.objects.all()
    data = {"holiday_list": holiday_list}
    return render_to_response('homepage.html', data, RequestContext(request))


def holiday_home(request, holiday):
    referer = request.META.get('HTTP_REFERER')
    if referer:
        referer = referer.rsplit('/', 2)[1]
        if Route.__name__.lower() == referer:
            form = RouteForm(request.POST)
        elif Accommodation.__name__.lower() == referer:
            form = AccommodationForm(request.POST)
        elif Place.__name__.lower() == referer:
            form = PlaceForm(request.POST)
        else:
            form = ''
        if form:
            if form.is_valid():
                form.save()
                # TODO: save holiday reference
                # TODO: Print message saved successfully
                print("Save successful!")
            else:
                # TODO: Print error message and redirect back to form
                print("Error: Not valid input!")
    holiday_obj = Holiday.objects.get(name=holiday)
    data = {"holiday_obj": holiday_obj}
    return render_to_response('holiday_home.html', data,
                              RequestContext(request))


def holiday(request):
    form = HolidayForm()
    return render_to_response('holiday.html', {'form': form},
                              RequestContext(request))


def route(request, holiday, route):
    holiday_obj = Holiday.objects.get(name=holiday)
    if route:
        route_obj = holiday_obj.routes.get(name=route)
        form = RouteForm(instance=route_obj)
    else:
        form = RouteForm()
    return render_to_response('route.html', {'form': form, 'holiday': holiday},
                              RequestContext(request))


def accommodation(request, holiday, accom):
    holiday_obj = Holiday.objects.get(name=holiday)
    if accom:
        accom_obj = holiday_obj.accommodations.get(name=accom)
        form = AccommodationForm(instance=accom_obj)
    else:
        form = AccommodationForm()
    return render_to_response('accommodation.html', {'form': form,
                              'holiday': holiday}, RequestContext(request))


def place(request, holiday, place):
    holiday_obj = Holiday.objects.get(name=holiday)
    if place:
        place_obj = holiday_obj.places.get(name=place)
        form = PlaceForm(instance=place_obj)
    else:
        form = PlaceForm()
    return render_to_response('place.html', {'form': form, 'holiday': holiday},
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
