from channels.generic.websocket import AsyncJsonWebsocketConsumer


def user_group(user_id):
    return f"user_{user_id}"


def organization_group(organization_id):
    return f"organization_{organization_id}"


SUPERADMIN_GROUP = "superadmins"


class RealtimeConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close(code=4401)
            return

        self.groups_to_join = [user_group(user.id)]
        if user.role == "SUB_ADMIN" and user.organization_id:
            self.groups_to_join.append(organization_group(user.organization_id))
        elif user.role == "SUPER_ADMIN":
            self.groups_to_join.append(SUPERADMIN_GROUP)

        for group in self.groups_to_join:
            await self.channel_layer.group_add(group, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        for group in getattr(self, "groups_to_join", []):
            await self.channel_layer.group_discard(group, self.channel_name)

    async def realtime_event(self, event):
        await self.send_json(event["payload"])
