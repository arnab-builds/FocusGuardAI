from django.contrib import admin
from .models import ActivityLog, Invitation, Language, Organization, Translation, User, UserInactivity

admin.site.register(User)
admin.site.register(Organization)
admin.site.register(Invitation)
admin.site.register(ActivityLog)
admin.site.register(UserInactivity)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = (
        "language_name",
        "native_name",
        "language_code",
        "is_active",
        "created_at",
        "updated_at",
    )
    list_filter = ("is_active",)
    search_fields = (
        "language_name",
        "native_name",
        "language_code",
    )


@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = (
        "key",
        "language",
        "translated_text",
        "created_at",
        "updated_at",
    )
    list_filter = ("language",)
    search_fields = (
        "key",
        "translated_text",
        "language__language_name",
        "language__language_code",
    )
