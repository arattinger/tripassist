from django.forms import ModelForm
from models import Holiday
from models import Route
from models import Accommodation
from models import Place
from widgets import JqSplitDateTimeWidget
from fields import JqSplitDateTimeField


class HolidayForm(ModelForm):
    class Meta:
        model = Holiday
        exclude = ("accommodations", "places", "routes", "user",
                   "last_changed", "created")


class RouteForm(ModelForm):
    class Meta:
        model = Route
        departure_time = JqSplitDateTimeField(widget=JqSplitDateTimeWidget(
            attrs={'date_class': 'datepicker', 'time_class': 'timepicker'}))
        arrival_time = JqSplitDateTimeField(widget=JqSplitDateTimeWidget(
            attrs={'date_class': 'datepicker', 'time_class': 'timepicker'}))
        exclude = ("created", "last_changed",
                   "departure_longitude", "departure_latitude",
                   "departure_altitude",
                   "arrival_longitude", "arrival_latitude",
                   "arrival_altitude", "files")


class AccommodationForm(ModelForm):
    class Meta:
        model = Accommodation
        start = JqSplitDateTimeField(widget=JqSplitDateTimeWidget(
            attrs={'date_class': 'datepicker', 'time_class': 'timepicker'}))
        end = JqSplitDateTimeField(widget=JqSplitDateTimeWidget(
            attrs={'date_class': 'datepicker', 'time_class': 'timepicker'}))
        exclude = ("created", "last_changed", "longitude", "latitude",
                   "altitude", "files")


class PlaceForm(ModelForm):
    class Meta:
        model = Place
        exclude = ("created", "last_changed", "longitude", "latitude",
                   "altitude", "files")
