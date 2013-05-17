from django.shortcuts import render_to_response, redirect
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.conf import settings
from os.path import join, basename
import mimetypes
from unicodedata import normalize
from django.http import HttpResponse
from models import Attachment, Holiday
from forms import HolidayForm, RouteForm, AccommodationForm, PlaceForm
import time


def mobile(request):
    return render_to_response('mobile.html', {}, RequestContext(request))


@login_required
def home(request):
    holiday_list = Holiday.objects.all()
    data = {"holiday_list": holiday_list}
    return render_to_response('homepage.html', data, RequestContext(request))


@login_required
def holiday_home(request, holiday_id):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    data = {"holiday_obj": holiday_obj}
    return render_to_response('holiday_home.html', data,
                              RequestContext(request))


@login_required
def holiday(request):
    if request.method == 'POST':
        form = HolidayForm(request.POST)
        if form.is_valid:
            holiday_obj = form.save(commit=False)
            holiday_obj.user = request.user
            holiday_obj.save()
            return redirect('home')
        else:
            print "error"
    elif request.method == 'GET':
        form = HolidayForm()
    return render_to_response('holiday.html', {'form': form},
                              RequestContext(request))


@login_required
def route(request, holiday_id, item_id=None):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    data = form_builder(request, RouteForm(), holiday_obj.routes, item_id)
    if data is None:
        return redirect('holiday_home', holiday_id=holiday_id)
    data['holiday_id'] = holiday_id
    return render_to_response('route.html', data, RequestContext(request))


@login_required
def accommodation(request, holiday_id, item_id=None):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    data = form_builder(request, AccommodationForm(),
                        holiday_obj.accommodations, item_id)
    if data is None:
        return redirect('holiday_home', holiday_id=holiday_id)
    data['holiday_id'] = holiday_id
    return render_to_response('accommodation.html', data,
                              RequestContext(request))


@login_required
def place(request, holiday_id, item_id=None):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    data = form_builder(request, PlaceForm(), holiday_obj.places, item_id)
    if data is None:
        return redirect('holiday_home', holiday_id=holiday_id)
    data['holiday_id'] = holiday_id
    return render_to_response('place.html', data, RequestContext(request))


@login_required
def form_builder(request, form, holiday_item, item_id):
    if request.method == 'POST':
        if item_id:
            form.__init__(request.POST, instance=holiday_item.get(pk=item_id))
        else:
            form.__init__(request.POST)
        if form.is_valid:
            if item_id:
                form.save()
            else:
                holiday_item.add(form.save())
            print 'save and redirect'
            return None
        else:
            print 'invalid input'
    elif request.method == 'GET':
        if item_id:
            form.__init__(instance=holiday_item.get(pk=item_id))
    data = {
        'form': form,
        'holiday_id': None,
        'item_id': item_id,
    }
    return data


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
