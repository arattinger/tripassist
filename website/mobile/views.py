from django.shortcuts import render_to_response, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.template import RequestContext
from django.conf import settings
from os.path import join, basename
import mimetypes
from unicodedata import normalize
from django.http import HttpResponse, HttpResponseRedirect
from models import Attachment, Holiday, Place, Route, Accommodation
from forms import HolidayForm, RouteForm, AccommodationForm, PlaceForm
import time


def mobile(request):
    return render_to_response('mobile.html', {}, RequestContext(request))


@login_required
def home(request):
    holiday_list = Holiday.objects.all()
    data = {'holiday_list': holiday_list}
    return render_to_response('homepage.html', data, RequestContext(request))


@login_required
def holiday_home(request, holiday_id):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    data = {'holiday_obj': holiday_obj}
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
            messages.success(request, 'Saved successfully!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid input!')
    elif request.method == 'GET':
        form = HolidayForm()
    return render_to_response('holiday.html', {'form': form},
                              RequestContext(request))


@login_required
def route(request, holiday_id, item_id=None):
    return form_builder(request, RouteForm, Route, holiday_id, item_id,
                        'route.html', 'routes')


@login_required
def accommodation(request, holiday_id, item_id=None):
    return form_builder(request, AccommodationForm, Accommodation, holiday_id,
                        item_id, 'accommodation.html', 'accommodations')


@login_required
def place(request, holiday_id, item_id=None):
    return form_builder(request, PlaceForm, Place, holiday_id, item_id,
                        'place.html', 'places')


@login_required
def form_builder(request, form, model, holiday_id, item_id, html, field):
    data = {'holiday_id': holiday_id}
    inst = None
    if item_id:
        data['item_id'] = item_id
        inst = model.objects.get(pk=item_id)
    if request.method == 'POST':
        form = form(request.POST, instance=inst)
        if form.is_valid():
            inst = form.save(inst)
            holiday = Holiday.objects.get(pk=holiday_id)
            getattr(holiday, field).add(inst)
            holiday.save()
            messages.success(request, 'Saved successfully!')
            return HttpResponseRedirect('/holiday/' + str(holiday_id))
        data['form'] = form
    else:
        data['form'] = form(instance=inst)
    return render_to_response(html, data, RequestContext(request))


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
    # look in filename for type (holyday or place etc) and return json
    # data holds content of json file
    # look for model to json wrapper or do it by hand
    # return render_to_response('holiday.json', data, RequestContext(request))
