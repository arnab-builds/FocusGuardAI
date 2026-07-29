from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.services.response_translation import TranslatedResponseMixin

from .models import FocusGoal
from .serializers import (
    FocusGoalSerializer,
    FocusPlanSerializer,
)
from .services import (
    update_goal_progress,
    generate_focus_plan,
)


class FocusGoalView(TranslatedResponseMixin, APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        goals = FocusGoal.objects.filter(
            user=request.user
        ).order_by("-created_at")

        for goal in goals:
            update_goal_progress(goal)

        serializer = FocusGoalSerializer(
            goals,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = FocusGoalSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        goal = serializer.save(
            user=request.user
        )

        update_goal_progress(goal)

        return Response(
            FocusGoalSerializer(goal).data,
            status=status.HTTP_201_CREATED,
        )


class FocusGoalDetailView(TranslatedResponseMixin, APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        goal = get_object_or_404(
            FocusGoal,
            pk=pk,
            user=request.user,
        )

        serializer = FocusGoalSerializer(
            goal,
            data=request.data,
            partial=True,
        )

        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        goal = serializer.save()

        update_goal_progress(goal)

        return Response(
            FocusGoalSerializer(goal).data
        )

    def delete(self, request, pk):

        goal = get_object_or_404(
            FocusGoal,
            pk=pk,
            user=request.user,
        )

        goal.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


class GenerateFocusPlanView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        goal = get_object_or_404(
            FocusGoal,
            pk=pk,
            user=request.user,
        )

        plan = generate_focus_plan(goal)

        serializer = FocusPlanSerializer(plan)

        return Response(
            {
                "message": "Focus plan generated successfully.",
                "plan": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class FocusPlanView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        goal = get_object_or_404(
            FocusGoal,
            pk=pk,
            user=request.user,
        )

        if not hasattr(goal, "plan"):
            return Response(
                {
                    "message": "No focus plan generated yet."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = FocusPlanSerializer(
            goal.plan
        )

        return Response(serializer.data)
