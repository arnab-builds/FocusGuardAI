from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [("users", "0023_runtimetranslation")]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("SUPER_ADMIN", "Super Admin"),
                    ("SUB_ADMIN", "Organization Admin"),
                    ("USER", "Employee"),
                    ("NORMAL_USER", "Normal User"),
                ],
                default="USER",
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="invitation",
            name="role",
            field=models.CharField(
                choices=[
                    ("SUPER_ADMIN", "Super Admin"),
                    ("SUB_ADMIN", "Organization Admin"),
                    ("USER", "Employee"),
                    ("NORMAL_USER", "Normal User"),
                ],
                max_length=20,
            ),
        ),
        migrations.CreateModel(
            name="NormalUserDeactivationRequest",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("reason", models.TextField()),
                ("status", models.CharField(choices=[("PENDING", "Pending"), ("APPROVED", "Approved"), ("REJECTED", "Rejected")], default="PENDING", max_length=20)),
                ("requested_at", models.DateTimeField(auto_now_add=True)),
                ("reviewed_at", models.DateTimeField(blank=True, null=True)),
                ("reviewed_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="reviewed_normal_user_deactivation_requests", to=settings.AUTH_USER_MODEL)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="normal_user_deactivation_requests", to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
