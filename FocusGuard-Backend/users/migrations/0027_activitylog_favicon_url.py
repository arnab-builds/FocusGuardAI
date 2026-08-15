from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0026_user_closed_username"),
    ]

    operations = [
        migrations.AddField(
            model_name="activitylog",
            name="favicon_url",
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
    ]
