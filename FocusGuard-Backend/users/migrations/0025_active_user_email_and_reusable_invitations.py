from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0024_normal_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name="invitation",
            name="email",
            field=models.EmailField(max_length=254),
        ),
        migrations.AddConstraint(
            model_name="user",
            constraint=models.UniqueConstraint(
                condition=models.Q(("is_active", True)),
                fields=("email",),
                name="unique_active_user_email",
            ),
        ),
    ]
