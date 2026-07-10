from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group

from .models import User


@receiver(post_save, sender=User)
def assign_super_admin_group(sender, instance, created, **kwargs):

    if instance.is_superuser and instance.role != "SUPER_ADMIN":
        instance.role = "SUPER_ADMIN"
        instance.save(update_fields=["role"])

    if instance.is_superuser:
        group, _ = Group.objects.get_or_create(
            name="Super Admin"
        )
        instance.groups.add(group)