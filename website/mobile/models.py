from django.db import models
from django.utils.timezone import now


def _get_upload_dir(instance, filename):
    pass


class Attachment(models.Model):
    attachment = models.FileField(upload_to=_get_upload_dir, blank=True,
                                  max_length=512)


class Route(models.Model):
    name = models.CharField(max_length=255, blank=True)
    type = models.PositiveSmallIntegerField()
    created = models.DateTimeField(default=now)
    last_changed = models.DateTimeField(default=now)

    departure_name = models.CharField(max_length=255, blank=True)
    departure_time = models.DateTimeField(null=True, blank=True)
    departure_longitude = models.FloatField(null=True, blank=True)
    departure_latitude = models.FloatField(null=True, blank=True)
    departure_altitude = models.FloatField(null=True, blank=True)
    depature_address = models.CharField(max_length=255, blank=True)

    arrival_name = models.CharField(max_length=255, blank=True)
    arrival_time = models.DateTimeField(null=True, blank=True)
    arrival_longitude = models.FloatField(null=True, blank=True)
    arrival_latitude = models.FloatField(null=True, blank=True)
    arrival_altitude = models.FloatField(null=True, blank=True)
    arrival_address = models.CharField(max_length=255, blank=True)

    files = models.ManyToManyField(Attachment, blank=True)


class Place(models.Model):
    name = models.CharField(max_length=255, blank=True)
    type = models.PositiveSmallIntegerField()
    created = models.DateTimeField(default=now)
    last_changed = models.DateTimeField(default=now)
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    altitude = models.FloatField(null=True, blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(max_length=254, blank=True)
    phone_number = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    files = models.ManyToManyField(Attachment, blank=True)


class Accomodation(models.Model):
    name = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(default=now)
    last_changed = models.DateTimeField(default=now)
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    altitude = models.FloatField(null=True, blank=True)
    website = models.URLField(blank=True)
    email = models.EmailField(max_length=254, blank=True)
    phone_number = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    files = models.ManyToManyField(Attachment, blank=True)

    start = models.DateTimeField(null=True, blank=True)
    end = models.DateTimeField(null=True, blank=True)


class Holiday(models.Model):
    name = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(default=now)
    last_changed = models.DateTimeField(default=now)
    accomodations = models.ManyToManyField(Accomodation, blank=True)
    places = models.ManyToManyField(Place, blank=True)
    routes = models.ManyToManyField(Route, blank=True)
