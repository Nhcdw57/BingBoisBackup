from django.contrib import admin
from backend.models import Company, Cref, Position, Pref, Uref, Usertable

# Register your models here.
admin.site.register(Company)
admin.site.register(Cref)
admin.site.register(Position)
admin.site.register(Pref)
admin.site.register(Uref)
admin.site.register(Usertable)

from backend.models import Test
admin.site.register(Test)