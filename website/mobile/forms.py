from django.forms import ModelForm
from models import Holiday
from models import Route
from models import Accommodation
from models import Place


class HolidayForm(ModelForm):
    class Meta:
        model = Holiday


class RouteForm(ModelForm):
    class Meta:
        model = Route


class AccommodationForm(ModelForm):
    class Meta:
        model = Accommodation


class PlaceForm(ModelForm):
    class Meta:
        model = Place
