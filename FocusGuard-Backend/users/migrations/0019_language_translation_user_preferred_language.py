from django.db import migrations, models
import django.db.models.deletion


INITIAL_LANGUAGES = [
    ("English", "en"),
    ("Bengali", "bn"),
    ("Gujarati", "gu"),
    ("Hindi", "hi"),
    ("Kannada", "kn"),
    ("Malayalam", "ml"),
    ("Marathi", "mr"),
    ("Odia", "or"),
    ("Punjabi", "pa"),
    ("Tamil", "ta"),
    ("Telugu", "te"),
]


def seed_languages(apps, schema_editor):
    Language = apps.get_model("users", "Language")
    User = apps.get_model("users", "User")

    for language_name, language_code in INITIAL_LANGUAGES:
        Language.objects.update_or_create(
            language_code=language_code,
            defaults={
                "language_name": language_name,
                "is_active": True,
            },
        )

    english = Language.objects.filter(
        language_code="en"
    ).first()

    if english:
        User.objects.filter(
            preferred_language__isnull=True
        ).update(
            preferred_language=english
        )


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0018_organization_contact_number_organization_email_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Language",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "language_name",
                    models.CharField(max_length=100, unique=True),
                ),
                (
                    "language_code",
                    models.CharField(max_length=10, unique=True),
                ),
                (
                    "is_active",
                    models.BooleanField(default=True),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True),
                ),
            ],
            options={
                "ordering": ["language_name"],
            },
        ),
        migrations.CreateModel(
            name="Translation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "key",
                    models.CharField(max_length=255),
                ),
                (
                    "translated_text",
                    models.TextField(),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True),
                ),
                (
                    "language",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="translations",
                        to="users.language",
                    ),
                ),
            ],
            options={
                "ordering": ["key", "language__language_name"],
            },
        ),
        migrations.AddConstraint(
            model_name="translation",
            constraint=models.UniqueConstraint(
                fields=("language", "key"),
                name="unique_translation_per_language",
            ),
        ),
        migrations.AddField(
            model_name="user",
            name="preferred_language",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="users",
                to="users.language",
            ),
        ),
        migrations.RunPython(
            seed_languages,
            migrations.RunPython.noop,
        ),
    ]
