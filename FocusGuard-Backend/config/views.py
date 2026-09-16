from django.http import HttpResponse
from django.views.decorators.http import require_GET

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FocusGuard AI Backend</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background: white;
            padding: 2.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
        }
        h1 {
            margin-top: 0;
            color: #2c3e50;
            font-size: 1.5rem;
        }
        p {
            color: #6c757d;
            line-height: 1.5;
        }
        .links {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .link-card {
            display: block;
            padding: 1rem;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            text-decoration: none;
            color: #0056b3;
            transition: all 0.2s ease;
        }
        .link-card:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .link-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        .link-desc {
            font-size: 0.875rem;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>FocusGuard AI API</h1>
        <p>Welcome to the FocusGuard AI backend service. The system is operational.</p>
        
        <div class="links">
            <a href="/api/docs/" class="link-card">
                <div class="link-title">Swagger API Documentation</div>
                <div class="link-desc">Interactive REST API explorer</div>
            </a>
            <a href="/health/" class="link-card">
                <div class="link-title">Health Check</div>
                <div class="link-desc">System liveness status</div>
            </a>
            <a href="/api/schema/" class="link-card">
                <div class="link-title">OpenAPI Schema</div>
                <div class="link-desc">Raw OpenAPI v3 specifications</div>
            </a>
        </div>
    </div>
</body>
</html>"""

@require_GET
def root_view(request):
    """Return a simple landing page for the root URL."""
    return HttpResponse(HTML_CONTENT)

