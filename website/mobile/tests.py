from django.test import TestCase
import json
from django.contrib.auth.models import User
from django.test.client import Client
from models import Holiday, Accommodation, Route, Place
from django.utils.timezone import now

username = "test"
password = "test"

holiday_name = "holiday1"
holiday_description = "This is a test holiday"

route_name = "route1"
route_type = 1  # Train
departure_name = "graz"
arrival_name = "wien"
route_description = "Direktzug von Graz nach Wien"

place_name = "home"
place_type = 0
website = "http://google.com"
address = "steyrergasse"
place_description = "This is a place where someone lives"

accommodation_name = "hotel1"
accommodation_type = 2
accommodation_description = "Test Accommodation"
start = now()
end = now()


class MobileTest(TestCase):
    def create_user_and_client(self):
        self.client = Client()
        self.user = User.objects.create_user(username, 'a@test.com', password)

    def setUp(self):
        self.create_user_and_client()

    def login(self):
        self.client.login(username=username, password=password)

    def get_holiday(self):
        self.login()
        resp = self.client.get('/download/holidays.json')
        self.assertEqual(resp.status_code, 200)
        return json.loads(resp.content)

    def create_holiday(self):
        return Holiday.objects.create(name=holiday_name, user=self.user,
                                      description=holiday_description)

    def create_route(self):
        return Route.objects.create(
            name=route_name, type=route_type, departure_name=departure_name,
            arrival_name=arrival_name, description=route_description)

    def create_place(self):
        return Place.objects.create(
            name=place_name, type=place_type, website=website, address=address,
            description=place_description)

    def create_accommodation(self):
        return Accommodation.objects.create(
            name=accommodation_name, type=accommodation_type,
            description=accommodation_description, start=start, end=end)


class SimpleHolidayTest(MobileTest):

    def test_login(self):
        self.login()
        resp = self.client.get('/download/holidays.json')
        self.assertEqual(resp.status_code, 200)

    def test_holiday_json(self):
        holiday = self.create_holiday()
        print "Running HolidayTest"
        resp = self.get_holiday()
        self.assertEqual(resp[0]['name'], holiday_name)
        self.assertEqual(resp[0]['description'], holiday_description)


class SimpleRouteTest(MobileTest):

    def setUp(self):
        self.create_user_and_client()
        holiday = self.create_holiday()
        route = self.create_route()
        holiday.routes.add(route)
        holiday.save()

    def test_route_json(self):
        resp = self.get_holiday()
        route = resp[0]['routes'][0]
        self.assertEqual(route['name'], route_name)
        self.assertEqual(route['type'], route_type)
        self.assertEqual(route['departure_name'], departure_name)
        self.assertEqual(route['arrival_name'], arrival_name)
        self.assertEqual(route['description'], route_description)


class SimplePlaceTest(MobileTest):

    def setUp(self):
        self.create_user_and_client()
        holiday = self.create_holiday()
        self.place = self.create_place()
        holiday.places.add(self.place)
        holiday.save()

    def test_place_json(self):
        resp = self.get_holiday()
        place = resp[0]['places'][0]
        self.assertEqual(place['name'], place_name)
        self.assertEqual(place['type'], place_type)
        self.assertEqual(place['website'], website)
        self.assertEqual(place['address'], address)
        self.assertEqual(place['description'], place_description)


class SimpleAccommodationTest(MobileTest):

    def setUp(self):
        self.create_user_and_client()
        holiday = self.create_holiday()
        self.accommodation = self.create_accommodation()
        holiday.accommodations.add(self.accommodation)
        holiday.save()

    def test_accommodation_json(self):
        resp = self.get_holiday()
        accommodation = resp[0]['accommodations'][0]
        self.assertEqual(accommodation['name'], accommodation_name)
        self.assertEqual(accommodation['type'], accommodation_type)
        self.assertEqual(accommodation['description'], accommodation_description)
