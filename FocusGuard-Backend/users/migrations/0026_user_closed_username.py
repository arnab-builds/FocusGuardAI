import uuid

from django.db import migrations, models


def release_existing_closed_usernames(apps, schema_editor):
    User = apps.get_model("users", "User")

    for user in User.objects.filter(is_active=False):
        if not user.closed_username:
            user.closed_username = user.username
            user.username = f"closed-{user.id}-{uuid.uuid4().hex[:12]}"
            user.save(update_fields=["closed_username", "username"])


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0025_active_user_email_and_reusable_invitations"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="closed_username",
            field=models.CharField(
                blank=True,
                editable=False,
                max_length=150,
                null=True,
            ),
        ),
        migrations.RunPython(
            release_existing_closed_usernames,
            migrations.RunPython.noop,
        ),
    ]
