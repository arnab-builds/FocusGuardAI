# Generated for Organization Admin notification events.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0003_alter_notification_options_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="notification",
            name="notification_type",
            field=models.CharField(
                choices=[
                    ("IDLE", "Idle Too Long"),
                    ("NON_PRODUCTIVE", "Non Productive Limit"),
                    ("PRODUCTIVE_SESSION", "Productive Work Session"),
                    ("INVITATION", "Invitation"),
                    ("REQUEST", "Request"),
                    ("SYSTEM", "System"),
                ],
                max_length=30,
            ),
        ),
    ]
