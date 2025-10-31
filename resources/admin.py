from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'created_by', 'created_at', 'updated_at')
    list_filter = ('created_by', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'url')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Resource Information', {
            'fields': ('name', 'url', 'description')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
