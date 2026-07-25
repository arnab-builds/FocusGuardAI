from users.views import calculate_user_analytics

from .ai import generate_focus_plan_ai

from .models import FocusGoal, FocusPlan
from .prompts import PLANNER_PROMPT


def update_goal_progress(goal):

    analytics = calculate_user_analytics(
        goal.user,
        selected_date=None,
    )

    progress = 0

    if goal.goal_metric == "Deep Work Session":

        productive_hours = analytics.get(
            "productive_hours",
            0,
        )

        if goal.target_value > 0:
            progress = (
                productive_hours / goal.target_value
            ) * 100

    elif goal.goal_metric == "Daily Focus Score Target":

        focus_score = analytics.get(
            "focus_score",
            0,
        )

        if goal.target_value > 0:
            progress = (
                focus_score / goal.target_value
            ) * 100

    elif goal.goal_metric == "Social Media Limit":

        social_media_time = analytics.get(
            "social_media_time",
            0,
        )

        if social_media_time <= goal.target_value:
            progress = 100
        elif social_media_time > 0:
            progress = (
                goal.target_value / social_media_time
            ) * 100

    elif goal.goal_metric == "Daily Screen Time Limit":

        screen_time = analytics.get(
            "screen_time",
            0,
        )

        if screen_time <= goal.target_value:
            progress = 100
        elif screen_time > 0:
            progress = (
                goal.target_value / screen_time
            ) * 100

    progress = min(progress, 100)

    goal.progress = round(progress, 2)

    if progress >= 100:
        goal.status = "Completed"

    elif progress >= 70:
        goal.status = "On Track"

    else:
        goal.status = "At Risk"

    goal.save()

    return goal


from .ai import generate_focus_plan_ai


def generate_focus_plan(goal):

    analytics = calculate_user_analytics(
        goal.user,
        selected_date=None,
    )

    prompt = f"""
{PLANNER_PROMPT}

You are an expert Productivity Coach.

Create a professional execution plan.

Goal Metric:
{goal.goal_metric}

Target:
{goal.target_value}

Priority:
{goal.priority}

Deadline:
{goal.deadline}

Notes:
{goal.notes}

User Analytics:
{analytics}

Return ONLY markdown.

Use EXACTLY this format.

# 🎯 Today's Focus Plan

## 📌 Goal Summary

Write 2-3 lines explaining today's objective.

---

## 🗓 Schedule

IMPORTANT:
The schedule MUST be a valid Markdown table.

Example:

| Time | Task |
|------|------|
| 9:00 AM – 12:00 PM | Coding Practice |
| 1:00 PM – 3:00 PM | Remote Access Lab |
| 4:00 PM – 6:00 PM | AI Chat & Search Engine |

Each row MUST be on a new line.

Never put the entire table on one line.

## ✅ Action Checklist

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
- [ ] Task 4

---

## 🚀 Productivity Tips

- Tip 1
- Tip 2
- Tip 3

---

## ⚠ Risks

- Risk 1
- Risk 2

---

## 📈 Expected Outcome

Write 2 lines describing the expected result.

Do not write anything outside the markdown.
"""

    ai_plan = generate_focus_plan_ai(prompt)

    plan, created = FocusPlan.objects.update_or_create(
        goal=goal,
        defaults={
            "plan": ai_plan,
        },
    )

    return plan