from django.http import HttpResponse, JsonResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

import json
import random
import datetime

from .models import Position, Usertable, Company

def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render({}, request))

def account(request):
    template = loader.get_template('accounts.html')
    return HttpResponse(template.render({}, request))

def job_search(request):
    jobs = []
    for job in Position.objects.all():
        if job.isavailable:
            jobs.append({
                'id': job.positionid,
                'title': job.title, 
                'description': job.description, 
                'postingexpirationdate': job.postingexpirationdate,
                'location': job.location,
            })
    return JsonResponse({
        'jobs': jobs
    })

def user_search(request, id=None):
    employees=[]
    for user in Usertable.objects.filter(companyid=id).select_related('managerid'):
        manager = user.managerid
        employees.append({
            'firstname':user.firstname,
            'lastname':user.lastname,
            'email':user.email,
            'id':user.userid,
            'manager':None if (manager==None) else manager.userid
        })
    return JsonResponse({
        'employees':employees
    })

def username_search(request,username=None):
    for user in Usertable.objects.all().select_related('username').select_related('companyid'):
        userref = user.username
        companyref = user.companyid
        if(userref != None and userref.username==username):
            temp={'userid':user.userid,'companyid':companyref.companyid}
            return JsonResponse({'userdata':temp})
            

@csrf_exempt
def create_position(request):
    if request.method == 'POST':
        d = datetime.datetime.today()
        Position.objects.create(
            title=request.POST['title'],
            description=request.POST['job_description'],
            companyid=Company.objects.get(companyid = request.POST.get('companyID')),
            managerid=Usertable.objects.get(userid = request.POST.get('managerID')),
            publicvisible=request.POST.get('publicVisible') == 'true',
            isavailable=request.POST.get('isAvailible')== 'true',
            startdate=request.POST['start_date'],
            posteddate=d.strftime('%Y-%m-%d'),
            postingexpirationdate=request.POST['end_date'],
            location=request.POST['loc']
        )
        return HttpResponse()
    else:
        template = loader.get_template('addJobs.html')
        return HttpResponse(template.render({}, request))

def position(request, id=None):
    template = loader.get_template('individual.html')
    return HttpResponse(template.render({
        'position': Position.objects.get(positionid=id)
    }, request))

@csrf_exempt
def edit_position(request, id=None):
    if request.method == 'POST':
        d = datetime.datetime.today()
        Position.objects.filter(positionid=id).update(
            title=request.POST['title'],
            description=request.POST['job_description'],
            companyid=Company.objects.get(companyid = request.POST.get('companyID')),
            managerid=Usertable.objects.get(userid = request.POST.get('managerID')),
            publicvisible=request.POST.get('publicVisible') == 'true',
            isavailable=request.POST.get('isAvailible')== 'true',
            startdate=request.POST['start_date'],
            posteddate=d.strftime('%Y-%m-%d'),
            postingexpirationdate=request.POST['end_date'],
            location=request.POST['loc']
        )
        return HttpResponse()
    else:
        template = loader.get_template('addJobs.html')
        return HttpResponse(template.render({
            'position': Position.objects.get(positionid=id)
        }, request))

@csrf_exempt
def delete_position(request, id=None):
    if request.method == 'POST':
        Position.objects.filter(positionid=id).delete()
        return HttpResponse()



from .models import *
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('profile_create')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})


def experimental(request):
    return render(request,'Frontend Experimental/index.html')

from .models import Usertable

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from .forms import UsertableForm

def UsertableCreateForm(request):
    form = UsertableForm()
    if request.method == "POST":
        form = UsertableForm(request.POST)
        if form.is_valid():
            new_usertable = form.save(commit=False)
            new_usertable.username = request.user
            new_usertable.save()
            return redirect('index')
    else:
        form = form = UsertableForm()
    return render(request, 'Usertable_form.html', {'form': form})

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

