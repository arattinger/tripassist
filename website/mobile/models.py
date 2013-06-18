from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User
from os.path import join
import datetime


ROUTE_DEFAULT = 0
ROUTE_CHOICES = (
    (0, 'Bus'),
    (1, 'Train'),
    (2, 'Plane'),
)
PLACE_DEFAULT = 0
PLACE_CHOICES = (
    (0, 'Hotel'),
    (1, 'Hostel'),
)

ACCOMMODATION_DEFAULT = 0
ACCOMMODATION_CHOICES = (
    (0, 'Landmark'),
    (1, 'Museum'),
    (2, 'Cultural'),
    (3, 'Outdoor'),
)


def _get_upload_dir(instance, filename):
    upload_dir = join("attachment", instance.user.username, filename)
    return upload_dir


class Attachment(models.Model):
    attachment = models.FileField(upload_to=_get_upload_dir, blank=True,
                                  max_length=512)
    # Save the user in the attachment model for easier lookups
    user = models.ForeignKey(User)


class Route(models.Model):
    name = models.CharField(max_length=255, blank=True)
    type = models.PositiveSmallIntegerField(
        default=ROUTE_DEFAULT, choices=ROUTE_CHOICES)
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
    description = models.TextField(blank=True)
    files = models.ManyToManyField(Attachment, blank=True)

    def __unicode__(self):
        return u"%s: %s" % (self.name, self.type)


class Place(models.Model):
    name = models.CharField(max_length=255)
    type = models.PositiveSmallIntegerField(
        default=PLACE_DEFAULT, choices=PLACE_CHOICES)
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
    description = models.TextField(blank=True)

    def __unicode__(self):
        return u"%s: %s" % (self.name, self.type)


class Accommodation(models.Model):
    name = models.CharField(max_length=255, blank=True)
    type = models.PositiveSmallIntegerField(
        default=ACCOMMODATION_DEFAULT, choices=ACCOMMODATION_CHOICES)
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
    description = models.TextField(blank=True)
    start = models.DateField()
    end = models.DateField()

    def __unicode__(self):
        return u"%s: %s" % (self.name, self.type)


class Holiday(models.Model):
    name = models.CharField(max_length=255, blank=True)
    created = models.DateTimeField(default=now)
    last_changed = models.DateTimeField(default=now)
    accommodations = models.ManyToManyField(Accommodation, blank=True)
    places = models.ManyToManyField(Place, blank=True)
    routes = models.ManyToManyField(Route, blank=True)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User)

    def __unicode__(self):
        return u"%s" % (self.name)
