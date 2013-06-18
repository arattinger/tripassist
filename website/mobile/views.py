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
from django.forms.models import model_to_dict
import json
from django.views.decorators.csrf import csrf_exempt


def serialize_foreign_key(data, model, field):
    new_data = []
    for model_id in data[field]:
        new_data.append(model_to_dict(model.objects.get(id=model_id),
                        fields=[], exclude=[]))
    data[field] = new_data


@csrf_exempt
@login_required
def get_serialized_holiday(request, holiday_id=None):
    if holiday_id:
        # Return all model information from a single holiday as json
        holiday = Holiday.objects.filter(user=request.user).get(id=holiday_id)
        holiday_data = model_to_dict(holiday, fields=[], exclude=[])
        serialize_foreign_key(holiday_data, Route, 'routes')
        serialize_foreign_key(holiday_data, Accommodation, 'accommodations')
        serialize_foreign_key(holiday_data, Place, 'places')

    else:
        holidays = Holiday.objects.filter(user=request.user)
        holiday_data = []
        for holiday in holidays:
            holiday_data.append(model_to_dict(holiday, fields=[], exclude=[]))
            serialize_foreign_key(holiday_data[-1], Route, 'routes')
            serialize_foreign_key(holiday_data[-1], Accommodation, 'accommodations')
            serialize_foreign_key(holiday_data[-1], Place, 'places')

    dthandler = lambda obj: obj.isoformat() if hasattr(obj, 'isoformat') else None
    return HttpResponse(json.dumps(holiday_data, default=dthandler))


def mobile(request):
    return render_to_response('mobile.html', {}, RequestContext(request))


@csrf_exempt
@login_required
def home(request):
    holiday_list = Holiday.objects.filter(user=request.user)
    data = {'holiday_list': holiday_list}
    return render_to_response('homepage.html', data, RequestContext(request))


@csrf_exempt
@login_required
def holiday_home(request, holiday_id):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    data = {'holiday_obj': holiday_obj}
    return render_to_response('holiday_home.html', data,
                              RequestContext(request))


@csrf_exempt
@login_required
def edit_holiday(request, holiday_id):
    holiday_obj = Holiday.objects.get(pk=holiday_id)
    if request.method == 'POST':
        if 'change_holiday_name' in request.POST:
            holiday_obj.name = request.POST['holiday_name']
            holiday_obj.save()
            messages.success(request, 'Saved successfully!')
        elif 'delete_selection' in request.POST:
            fields = request.POST.getlist("route")
            for field_id in fields:
                instance = Route.objects.get(id=field_id)
                instance.delete()
            fields = request.POST.getlist("accom")
            for field_id in fields:
                instance = Accommodation.objects.get(id=field_id)
                instance.delete()
            fields = request.POST.getlist("place")
            for field_id in fields:
                instance = Place.objects.get(id=field_id)
                instance.delete()
            messages.success(request, 'Nodes deleted!')
        elif 'erase_holiday' in request.POST:
            holiday_obj.delete()
            # delete dependencies? show warning (message box)!
            messages.success(request, 'Holiday deleted!')
            return redirect('home')

    data = {'holiday_obj': holiday_obj}
    return render_to_response('edit_holiday.html', data,
                              RequestContext(request))


@csrf_exempt
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


@csrf_exempt
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
    init_attachments = None
    if item_id:
        inst = model.objects.get(pk=item_id)
        data['title'] = inst.name
        data['item_id'] = item_id
        if inst.files.count() > 0:
            init_attachments = {"attachments": inst.files.all()}
    else:
        data['title'] = 'Add %s' % (field)
    if request.method == 'POST':
        form = form(request.POST, instance=inst)
        if form.is_valid():
            inst = form.save(inst)
            inst.save()
            if 'file' in request.FILES:
                fileitem = request.FILES['file']
                newFile = Attachment(attachment=fileitem, user=request.user)
                newFile.save()
                inst.files.add(newFile)
                inst.save()
            holiday = Holiday.objects.get(pk=holiday_id)
            getattr(holiday, field).add(inst)
            holiday.save()
            messages.success(request, 'Saved successfully!')
            return HttpResponseRedirect('/holiday/' + str(holiday_id))
        data['form'] = form
    else:
        data['form'] = form(instance=inst, initial=init_attachments)
    return render_to_response(html, data, RequestContext(request))


def manifest(request):
    data = {"username": request.user.username}
    return render_to_response('manifest.html', data, RequestContext(request))


@csrf_exempt
@login_required
def cache_manifest(request):
    attachments = Attachment.objects.filter(user=request.user)
    data = {
        "attachments": attachments,
        "username": request.user.username,
        "timestamp": int(time.time()),
        "no_of_holidays": range(1, len(Holiday.objects.filter(user=request.user))+1),
    }
    return render_to_response('cache.manifest', data, RequestContext(request))


@csrf_exempt
@login_required
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
