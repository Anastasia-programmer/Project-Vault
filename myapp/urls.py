from django.urls import path 
from . import views 
urlpatterns =[
    path('', views.index , name='index'),
    path('register',views.register, name='register'),
    path('login',views.login, name='login'),
    path('logout',views.logout, name='logout'),
    path('update-project/<int:project_id>/', views.update_project, name='update_project'),
    path('delete-project/<int:project_id>/', views.delete_project, name='delete_project'),
]