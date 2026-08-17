from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Contact

class ContactIsolationTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(username='user2@example.com', password='password123')

        self.contact1 = Contact.objects.create(owner=self.user1, name='Alice User 1')
        self.contact2 = Contact.objects.create(owner=self.user2, name='Bob User 2')

        self.client1 = APIClient()
        # Login user1 and set token
        response = self.client1.post('/api/auth/login/', {'email': 'user1@example.com', 'password': 'password123'})
        self.token1 = response.data['access']
        self.client1.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token1)

        self.client2 = APIClient()
        # Login user2 and set token
        response = self.client2.post('/api/auth/login/', {'email': 'user2@example.com', 'password': 'password123'})
        self.token2 = response.data['access']
        self.client2.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token2)

    def test_list_isolation(self):
        # User 1 should only see contact1
        response = self.client1.get('/api/contacts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Alice User 1')

    def test_retrieve_isolation(self):
        # User 1 cannot retrieve user 2's contact
        response = self.client1.get(f'/api/contacts/{self.contact2.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_isolation(self):
        # User 1 cannot update user 2's contact
        response = self.client1.patch(f'/api/contacts/{self.contact2.id}/', {'name': 'Hacked Name'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_isolation(self):
        # User 1 cannot delete user 2's contact
        response = self.client1.delete(f'/api/contacts/{self.contact2.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
