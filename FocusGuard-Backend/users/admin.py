from django.contrib import admin
from .models import User, Organization, Invitation, ActivityLog, UserInactivity

admin.site.register(User)
admin.site.register(Organization)
admin.site.register(Invitation)
admin.site.register(ActivityLog)
admin.site.register(UserInactivity)