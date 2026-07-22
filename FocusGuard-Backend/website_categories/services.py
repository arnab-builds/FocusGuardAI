import json

from llm.providers.gemini import GeminiProvider
from llm.providers.grok import GrokProvider

from .models import WebsiteCategory
from .prompts import CATEGORY_PROMPT


def categorize_website(domain):

    domain = domain.lower()

    website = WebsiteCategory.objects.filter(
        domain=domain
    ).first()

    if website:
        return website, True

    user_prompt = f"Domain: {domain}"

    providers = [
        GeminiProvider(api_type="category"),
        GrokProvider(),
    ]

    last_exception = None

    for provider in providers:

        try:

            response = provider.generate(
                CATEGORY_PROMPT,
                user_prompt,
            )

            data = json.loads(response)

            website = WebsiteCategory.objects.create(
                domain=domain,
                category=data["category"],
                productivity_type=data["productivity_type"],
            )

            return website, False

        except Exception as e:
            last_exception = e
            continue

    raise last_exception