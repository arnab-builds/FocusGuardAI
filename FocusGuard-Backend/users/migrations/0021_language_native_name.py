from django.db import migrations, models


NATIVE_LANGUAGE_NAMES = {
    "en": "English",
    "bn": "বাংলা",
    "gu": "ગુજરાતી",
    "hi": "हिन्दी",
    "kn": "ಕನ್ನಡ",
    "ml": "മലയാളം",
    "mr": "मराठी",
    "or": "ଓଡ଼ିଆ",
    "pa": "ਪੰਜਾਬੀ",
    "ta": "தமிழ்",
    "te": "తెలుగు",
}


def seed_native_language_names(apps, schema_editor):
    Language = apps.get_model("users", "Language")

    for language_code, native_name in NATIVE_LANGUAGE_NAMES.items():
        Language.objects.filter(
            language_code=language_code
        ).update(
            native_name=native_name
        )

    for language in Language.objects.filter(native_name=""):
        language.native_name = language.language_name
        language.save(update_fields=["native_name"])


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0020_seed_public_page_translations"),
    ]

    operations = [
        migrations.AddField(
            model_name="language",
            name="native_name",
            field=models.CharField(default="", max_length=100),
            preserve_default=False,
        ),
        migrations.RunPython(
            seed_native_language_names,
            migrations.RunPython.noop,
        ),
    ]
