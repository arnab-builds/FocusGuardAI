from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0027_activitylog_favicon_url"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="activitylog",
            index=models.Index(
                fields=["user", "start_time"], name="activity_user_start_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="userinactivity",
            index=models.Index(
                fields=["user", "inactive_from"], name="inactive_user_start_idx"
            ),
        ),
    ]
