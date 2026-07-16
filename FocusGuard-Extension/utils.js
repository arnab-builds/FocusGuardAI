// Convert hostname into a readable website name

export function getWebsiteName(url) {

    try {

        const hostname = new URL(url).hostname
            .replace("www.", "");

        const WEBSITE_NAMES = {

            "google.com": "Google",

            "github.com": "GitHub",

            "chatgpt.com": "ChatGPT",

            "leetcode.com": "LeetCode",

            "youtube.com": "YouTube",

            "linkedin.com": "LinkedIn",

            "facebook.com": "Facebook",

            "instagram.com": "Instagram",

            "twitter.com": "Twitter",

            "x.com": "X",

            "stackoverflow.com": "Stack Overflow",

            "reddit.com": "Reddit",

            "wikipedia.org": "Wikipedia"

        };

        return WEBSITE_NAMES[hostname] || hostname;

    }

    catch {

        return "Unknown";

    }

}