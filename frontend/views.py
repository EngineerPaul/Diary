from django.views.generic import TemplateView


class HomePage(TemplateView):
    template_name = 'frontend/index.html'

class HelpPage(TemplateView): # удалить!
    template_name = 'frontend/help.html'

class OtherPage(TemplateView): # удалить!
    template_name = 'frontend/other.html'
    
class SettingsPage(TemplateView):
    template_name = 'frontend/settings.html'

class SearchPage(TemplateView):
    template_name = 'frontend/search.html'

class NotesPage(TemplateView):
    template_name = 'frontend/notes.html'

class NoticesPage(TemplateView):
    template_name = 'frontend/notices.html'
