from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import Language, Translation
from users.translations.translation_seed import TRANSLATIONS


class Command(BaseCommand):
    help = "Seed translation data into the Translation table."

    @transaction.atomic
    def handle(self, *args, **options):
        created = 0
        updated = 0
        missing_languages = []

        language_map = {
            language.language_code: language
            for language in Language.objects.filter(is_active=True)
        }

        for key, translations in TRANSLATIONS.items():

            for language_code, translated_text in translations.items():

                # The database stores short language codes (for example,
                # ``hi``), while the Sarvam-ready seed catalog uses regional
                # codes (``hi-IN``). Seed into the matching database record.
                language = (
                    language_map.get(language_code)
                    or language_map.get(language_code.split("-", 1)[0])
                )

                if not language:
                    if language_code not in missing_languages:
                        missing_languages.append(language_code)
                    continue

                _, was_created = Translation.objects.update_or_create(
                    language=language,
                    key=key,
                    defaults={
                        "translated_text": translated_text,
                    },
                )

                if was_created:
                    created += 1
                else:
                    updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Completed! Created: {created}, Updated: {updated}"
            )
        )

        if missing_languages:
            self.stdout.write(
                self.style.WARNING(
                    f"Languages not found: {', '.join(missing_languages)}"
                )
            )
