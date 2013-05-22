from django.forms import ModelForm, TextInput
from models import Holiday
from models import Route
from models import Accommodation
from models import Place


class HolidayForm(ModelForm):
    class Meta:
        model = Holiday
        exclude = ("accommodations", "places", "routes", "user",
                   "last_changed", "created")


class RouteForm(ModelForm):
    class Meta:
        model = Route
        widgets = {
            'departure_time': TextInput(attrs={'class': 'datetimepicker'}),
            'arrival_time': TextInput(attrs={'class': 'datetimepicker'}),
        }
        exclude = ("created", "last_changed", "departure_longitude",
                   "departure_latitude", "departure_altitude",
                   "arrival_longitude", "arrival_latitude", "arrival_altitude",
                   "files")


class AccommodationForm(ModelForm):
    class Meta:
        model = Accommodation
        widgets = {
            'start': TextInput(attrs={'class': 'datepicker'}),
            'end': TextInput(attrs={'class': 'datepicker'}),
        }
        exclude = ("created", "last_changed", "longitude", "latitude",
                   "altitude", "files")


class PlaceForm(ModelForm):
    class Meta:
        model = Place
        exclude = ("created", "last_changed", "longitude", "latitude",
                   "altitude", "files")
