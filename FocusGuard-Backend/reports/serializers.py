from rest_framework import serializers


class DailyReportSerializer(serializers.Serializer):

    productive_time = serializers.SerializerMethodField()

    non_productive_time = serializers.SerializerMethodField()

    idle_time = serializers.SerializerMethodField()

    websites_visited = serializers.IntegerField()

    tab_switches = serializers.IntegerField()

    productivity_percentage = serializers.FloatField()

    def format_duration(self, duration):

        if not duration:
            return "00:00:00"

        total_seconds = int(duration.total_seconds())

        hours = total_seconds // 3600

        minutes = (total_seconds % 3600) // 60

        seconds = total_seconds % 60

        return f"{hours:02}:{minutes:02}:{seconds:02}"

    def get_productive_time(self, obj):

        return self.format_duration(
            obj["productive_time"]
        )

    def get_non_productive_time(self, obj):

        return self.format_duration(
            obj["non_productive_time"]
        )

    def get_idle_time(self, obj):

        return self.format_duration(
            obj["idle_time"]
        )