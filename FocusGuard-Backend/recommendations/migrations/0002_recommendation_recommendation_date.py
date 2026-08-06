from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recommendations", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="recommendation",
            name="recommendation_date",
            field=models.DateField(null=True),
        ),
        migrations.RunSQL(
            "UPDATE recommendations_recommendation "
            "SET recommendation_date = DATE(created_at) "
            "WHERE recommendation_date IS NULL;",
            migrations.RunSQL.noop,
        ),
        migrations.AlterField(
            model_name="recommendation",
            name="recommendation_date",
            field=models.DateField(),
        ),
        migrations.AddConstraint(
            model_name="recommendation",
            constraint=models.UniqueConstraint(
                fields=("user", "recommendation_date"),
                name="unique_recommendation_per_user_date",
            ),
        ),
    ]
