from django.forms import ModelForm
from .models import Usertable

class UsertableForm(ModelForm):
    class Meta:
        model = Usertable
        fields = ['firstname','lastname','managerid','positionid','companyid','hashiringpriv','email','joindate']