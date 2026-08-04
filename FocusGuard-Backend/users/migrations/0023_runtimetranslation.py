from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0022_seed_remaining_public_page_translations"),
    ]

    operations = [
        migrations.CreateModel(
            name="RuntimeTranslation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("source_digest", models.CharField(max_length=64)),
                ("source_text", models.TextField()),
                ("target_language_code", models.CharField(max_length=10)),
                ("translated_text", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "constraints": [
                    models.UniqueConstraint(
                        fields=("source_digest", "target_language_code"),
                        name="unique_runtime_translation_per_language",
                    ),
                ],
            },
        ),
    ]
