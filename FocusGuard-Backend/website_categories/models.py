from django.db import models


PRODUCTIVITY_TYPES = [
    ("PRODUCTIVE", "Productive"),
    ("NON_PRODUCTIVE", "Non Productive"),
    ("NEUTRAL", "Neutral"),
]


class WebsiteCategory(models.Model):

    CATEGORY_CHOICES = [

        # ======================
        # Productivity & Work
        # ======================
        ("Development", "Development"),
        ("Programming", "Programming"),
        ("Coding Practice", "Coding Practice"),
        ("Documentation", "Documentation"),
        ("Version Control", "Version Control"),
        ("Cloud Services", "Cloud Services"),
        ("DevOps", "DevOps"),
        ("API Services", "API Services"),
        ("Project Management", "Project Management"),
        ("Collaboration", "Collaboration"),
        ("Communication", "Communication"),
        ("Email", "Email"),
        ("Office Tools", "Office Tools"),
        ("File Sharing", "File Sharing"),
        ("Cloud Storage", "Cloud Storage"),
        ("Remote Access", "Remote Access"),
        ("Productivity", "Productivity"),
        ("Calendar", "Calendar"),
        ("Notes", "Notes"),
        ("Task Management", "Task Management"),
        ("Time Tracking", "Time Tracking"),

        # ======================
        # Education
        # ======================
        ("Education", "Education"),
        ("Learning", "Learning"),
        ("Online Courses", "Online Courses"),
        ("E-Learning", "E-Learning"),
        ("Research", "Research"),
        ("Academic", "Academic"),
        ("University", "University"),
        ("School", "School"),
        ("Reference", "Reference"),
        ("Library", "Library"),
        ("Dictionary", "Dictionary"),
        ("Tutorials", "Tutorials"),
        ("Certification", "Certification"),

        # ======================
        # AI
        # ======================
        ("AI Tools", "AI Tools"),
        ("AI Chat", "AI Chat"),
        ("AI Coding", "AI Coding"),
        ("AI Image Generation", "AI Image Generation"),
        ("AI Video", "AI Video"),
        ("AI Writing", "AI Writing"),
        ("AI Search", "AI Search"),

        # ======================
        # Professional
        # ======================
        ("Professional Networking", "Professional Networking"),
        ("Job Search", "Job Search"),
        ("Recruitment", "Recruitment"),
        ("Freelancing", "Freelancing"),
        ("Portfolio", "Portfolio"),

        # ======================
        # Finance
        # ======================
        ("Banking", "Banking"),
        ("Finance", "Finance"),
        ("Investing", "Investing"),
        ("Stock Market", "Stock Market"),
        ("Cryptocurrency", "Cryptocurrency"),
        ("Insurance", "Insurance"),
        ("Tax", "Tax"),
        ("Payments", "Payments"),

        # ======================
        # Shopping
        # ======================
        ("Shopping", "Shopping"),
        ("E-Commerce", "E-Commerce"),
        ("Marketplace", "Marketplace"),
        ("Coupons", "Coupons"),
        ("Food Delivery", "Food Delivery"),

        # ======================
        # Social
        # ======================
        ("Social Media", "Social Media"),
        ("Forums", "Forums"),
        ("Communities", "Communities"),
        ("Blogging", "Blogging"),
        ("Messaging", "Messaging"),
        ("Dating", "Dating"),

        # ======================
        # Entertainment
        # ======================
        ("Entertainment", "Entertainment"),
        ("Streaming", "Streaming"),
        ("Video Streaming", "Video Streaming"),
        ("Music Streaming", "Music Streaming"),
        ("Movies", "Movies"),
        ("TV Shows", "TV Shows"),
        ("Anime", "Anime"),
        ("Comics", "Comics"),
        ("Podcasts", "Podcasts"),

        # ======================
        # Gaming
        # ======================
        ("Gaming", "Gaming"),
        ("Game Store", "Game Store"),
        ("Game Streaming", "Game Streaming"),
        ("Esports", "Esports"),

        # ======================
        # News
        # ======================
        ("News", "News"),
        ("Technology News", "Technology News"),
        ("Business News", "Business News"),
        ("Sports News", "Sports News"),
        ("Political News", "Political News"),
        ("Weather", "Weather"),

        # ======================
        # Health
        # ======================
        ("Health", "Health"),
        ("Medical", "Medical"),
        ("Fitness", "Fitness"),
        ("Mental Health", "Mental Health"),
        ("Nutrition", "Nutrition"),

        # ======================
        # Travel
        # ======================
        ("Travel", "Travel"),
        ("Maps", "Maps"),
        ("Navigation", "Navigation"),
        ("Hotels", "Hotels"),
        ("Flights", "Flights"),
        ("Transportation", "Transportation"),

        # ======================
        # Government
        # ======================
        ("Government", "Government"),
        ("Legal", "Legal"),
        ("Public Services", "Public Services"),

        # ======================
        # Personal
        # ======================
        ("Lifestyle", "Lifestyle"),
        ("Fashion", "Fashion"),
        ("Beauty", "Beauty"),
        ("Food", "Food"),
        ("Recipes", "Recipes"),
        ("Parenting", "Parenting"),
        ("Religion", "Religion"),
        ("Hobbies", "Hobbies"),
        ("Photography", "Photography"),
        ("Art & Design", "Art & Design"),

        # ======================
        # Security
        # ======================
        ("Cybersecurity", "Cybersecurity"),
        ("Privacy", "Privacy"),
        ("VPN", "VPN"),

        # ======================
        # Utilities
        # ======================
        ("Search Engine", "Search Engine"),
        ("Browser Tools", "Browser Tools"),
        ("Utilities", "Utilities"),
        ("Download", "Download"),
        ("Software", "Software"),
        ("Hosting", "Hosting"),
        ("Domains", "Domains"),
        ("URL Shortener", "URL Shortener"),
        ("Developer Tools", "Developer Tools"),

        # ======================
        # Adult
        # ======================
        ("Adult Content", "Adult Content"),

        # ======================
        # Misc
        # ======================
        ("Other", "Other"),
    ]

    domain = models.CharField(
        max_length=255,
        unique=True,
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
    )

    productivity_type = models.CharField(
        max_length=20,
        choices=PRODUCTIVITY_TYPES,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.domain} ({self.category})"