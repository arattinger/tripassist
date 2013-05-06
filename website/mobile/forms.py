from django.forms import ModelForm
from models import Holiday
from models import Accomodation

class HolidayForm(ModelForm):
    class Meta:
        model = Holiday


class AccomodationForm(ModelForm):
    class Meta:
        model = Accomodation
