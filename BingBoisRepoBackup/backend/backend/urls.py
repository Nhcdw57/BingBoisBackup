"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('jobs', views.job_search, name='jobs'),
    path('employees/<int:id>', views.user_search, name='employees'),
    path('positions/create', views.create_position, name='create_position'),
    path('positions/<int:id>', views.position, name='position'),
    path('positions/edit/<int:id>', views.edit_position, name='edit_position'),
    path('positions/delete/<int:id>', views.delete_position, name='delete_position'),
    path('account', views.account, name='account'),
    path('user/<str:username>',views.username_search,name='username_search')

]

#Add Django site authentication urls (for login, logout, password management)
urlpatterns += [
    path('accounts/', include('django.contrib.auth.urls')),
]
from django.conf.urls import url
urlpatterns += [
    url(r'^signup/$', views.signup, name='signup'),
    path('profile/create/', views.UsertableCreateForm, name='profile_create'),
    url(r'^experimental/$', views.experimental, name='experimental'),

]
