from django.shortcuts import render_to_response
from django.template import RequestContext


def mobile(request):
    return render_to_response('mobile.html', {}, RequestContext(request))
