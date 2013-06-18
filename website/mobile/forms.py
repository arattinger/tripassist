from django.forms import ModelForm, TextInput, MultipleChoiceField, HiddenInput
from models import Holiday, Route, Accommodation, Place
import os.path

class HolidayForm(ModelForm):
    class Meta:
        model = Holiday
        exclude = ('accommodations', 'places', 'routes', 'user',
                   'last_changed', 'created')


class RouteForm(ModelForm):
    files = MultipleChoiceField(choices=[])

    def __init__(self, *args, **kwargs):
        super(RouteForm, self).__init__(*args,**kwargs)
        viewAttachments(self, **kwargs)

    class Meta:
        model = Route
        widgets = {
            'departure_time': TextInput(attrs={'class': 'datetimepicker'}),
            'arrival_time': TextInput(attrs={'class': 'datetimepicker'}),
        }
        exclude = ('created', 'last_changed', 'departure_longitude',
                   'departure_latitude', 'departure_altitude',
                   'arrival_longitude', 'arrival_latitude', 'arrival_altitude')


class AccommodationForm(ModelForm):
    files = MultipleChoiceField(choices=[])

    def __init__(self, *args, **kwargs):
        super(AccommodationForm, self).__init__(*args,**kwargs)
        viewAttachments(self, **kwargs)

    class Meta:
        model = Accommodation
        widgets = {
            'start': TextInput(attrs={'class': 'datepicker'}),
            'end': TextInput(attrs={'class': 'datepicker'}),
        }
        exclude = ('created', 'last_changed', 'longitude', 'latitude',
                   'altitude')


class PlaceForm(ModelForm):
    files = MultipleChoiceField(required=False, choices=[])

    def __init__(self, *args, **kwargs):
        super(PlaceForm, self).__init__(*args,**kwargs)
        viewAttachments(self, **kwargs)

    class Meta:
        model = Place
        exclude = ('created', 'last_changed', 'longitude', 'latitude',
                   'altitude')

def viewAttachments(self, **kwargs):
    if 'initial' in kwargs and kwargs['initial'] != None:
        files = []
        for item in kwargs['initial']['attachments']:
            files.append((item.pk, os.path.basename(item.attachment.name)))
        self.fields['files'].choices = files
    else:
        del self.fields['files']