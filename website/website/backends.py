from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json


@csrf_exempt
def login_user(request):
    try:
        state = None
        username = password = ''
        if request.POST:
            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    state = True
                else:
                    state = False
            else:
                state = False
        return HttpResponse(json.dumps({"state": state}))
    except:
        import traceback
        traceback.print_exc()


class APIAuthBackend(object):
    def authenticate(self, username=None, password=None):
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        """ Get a User object from the user_id.
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
