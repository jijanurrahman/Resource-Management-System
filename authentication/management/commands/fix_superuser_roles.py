from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Fix superuser roles - assign admin role to superusers'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Fixing superuser roles...'))
        
        # Find all superusers without proper role
        superusers = User.objects.filter(is_superuser=True)
        
        for user in superusers:
            if not user.role or user.role == 'user':
                user.role = 'admin'
                user.save()
                self.stdout.write(f'Updated {user.email} role to admin')
            else:
                self.stdout.write(f'{user.email} already has role: {user.role}')
        
        self.stdout.write(
            self.style.SUCCESS('Superuser roles fixed successfully!')
        )
