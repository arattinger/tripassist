from django.forms import ModelForm
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
        exclude = ("created", "last_changed", "departure_time",
                   "departure_longitude", "departure_latitude",
                   "departure_altitude", "arrival_time",
                   "arrival_longitude", "arrival_latitude",
                   "arrival_altitude", "files")


class AccommodationForm(ModelForm):
    class Meta:
        model = Accommodation
        exclude = ("created", "last_changed", "longitude", "latitude",
                   "altitude", "files", "start", "end")


class PlaceForm(ModelForm):
    class Meta:
        model = Place
        exclude = ("created", "last_changed", "longitude", "latitude",
                   "altitude", "files")
