from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from resources.models import Resource

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test data for the Resource Management System'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating test data...'))
        
        # Create test users
        admin_user, created = User.objects.get_or_create(
            email='admin@example.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(f'Created admin user: {admin_user.email}')
        
        staff_user, created = User.objects.get_or_create(
            email='staff@example.com',
            defaults={
                'username': 'staff',
                'first_name': 'Staff',
                'last_name': 'Member',
                'role': 'staff'
            }
        )
        if created:
            staff_user.set_password('staff123')
            staff_user.save()
            self.stdout.write(f'Created staff user: {staff_user.email}')
        
        regular_user, created = User.objects.get_or_create(
            email='user@example.com',
            defaults={
                'username': 'user',
                'first_name': 'Regular',
                'last_name': 'User',
                'role': 'user'
            }
        )
        if created:
            regular_user.set_password('user123')
            regular_user.save()
            self.stdout.write(f'Created regular user: {regular_user.email}')
        
        # Create test resources
        test_resources = [
            {
                'name': 'Django Documentation',
                'url': 'https://docs.djangoproject.com/',
                'description': 'Official Django documentation with comprehensive guides, tutorials, and API reference.',
                'created_by': admin_user
            },
            {
                'name': 'Django REST Framework',
                'url': 'https://www.django-rest-framework.org/',
                'description': 'Powerful and flexible toolkit for building Web APIs in Django applications.',
                'created_by': staff_user
            },
            {
                'name': 'Python Official Website',
                'url': 'https://www.python.org/',
                'description': 'The official Python programming language website with downloads, documentation, and community resources.',
                'created_by': admin_user
            },
            {
                'name': 'MDN Web Docs',
                'url': 'https://developer.mozilla.org/',
                'description': 'Comprehensive web development documentation covering HTML, CSS, JavaScript, and web APIs.',
                'created_by': staff_user
            },
            {
                'name': 'GitHub',
                'url': 'https://github.com/',
                'description': 'Web-based version control and collaboration platform for software development projects.',
                'created_by': admin_user
            },
            {
                'name': 'Stack Overflow',
                'url': 'https://stackoverflow.com/',
                'description': 'Question and answer site for professional and enthusiast programmers.',
                'created_by': staff_user
            },
            {
                'name': 'VS Code',
                'url': 'https://code.visualstudio.com/',
                'description': 'Free, open-source code editor with built-in support for debugging, Git control, and extensions.',
                'created_by': admin_user
            },
            {
                'name': 'Bootstrap',
                'url': 'https://getbootstrap.com/',
                'description': 'Popular CSS framework for developing responsive and mobile-first websites.',
                'created_by': staff_user
            }
        ]
        
        for resource_data in test_resources:
            resource, created = Resource.objects.get_or_create(
                name=resource_data['name'],
                defaults=resource_data
            )
            if created:
                self.stdout.write(f'Created resource: {resource.name}')
        
        self.stdout.write(
            self.style.SUCCESS(
                '\nTest data created successfully!\n\n'
                'Test Users:\n'
                '- Admin: admin@example.com / admin123\n'
                '- Staff: staff@example.com / staff123\n'
                '- User: user@example.com / user123\n'
            )
        )
