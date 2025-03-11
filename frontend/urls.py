from django.urls import path

from .views import (
    HomePage, HelpPage, OtherPage, SettingsPage, SearchPage, NotesPage, NoticesPage
)


urlpatterns = [
    path('', HomePage.as_view(), name='index_url'),
    path('help', HelpPage.as_view(), name='help_url'),
    path('other', OtherPage.as_view(), name='other_url'),
    path('settings', SettingsPage.as_view(), name='settings_url'),
    path('searching', SearchPage.as_view(), name='search_url'),
    path('notes', NotesPage.as_view(), name='notes_url'),
    path('notices', NoticesPage.as_view(), name='notices_url'),
]
