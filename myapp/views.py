from django.shortcuts import render,redirect, get_object_or_404
from .models import Features, Project, TechStack
from django.contrib.auth.models import User,auth
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def index(request):
    """
    Main page - handles both GET (show page) and POST (create project)
    """
    if request.method == 'POST':
        # Handle form submission (create new project)
        if request.user.is_authenticated:
            title = request.POST.get('title')
            description = request.POST.get('description')
            status = request.POST.get('status', 'idea')
            difficulty = request.POST.get('difficulty', 'medium')
            priority = request.POST.get('priority', 'medium')
            github_url = request.POST.get('github', '')
            deployment_url = request.POST.get('deployment', '')
            
            # Create the project
            project = Project.objects.create(
                title=title,
                description=description,
                status=status,
                difficulty=difficulty,
                priority=priority,
                github_url=github_url,
                deployment_url=deployment_url,
                user=request.user
            )
           
            # Add tech stack items
            tech_stack = request.POST.getlist('tech_stack')
            for tech in tech_stack:
                if tech.strip():  # Only add non-empty tech items
                    TechStack.objects.create(project=project, name=tech.strip())
            
            messages.success(request, 'Project created successfully!')
            return redirect('index')
        else:
            messages.error(request, 'Please log in to create projects.')
            return redirect('login')
    
    # Handle GET request (show page)
    if request.user.is_authenticated:
        projects = Project.objects.filter(user=request.user).order_by('-created_at')
    else:
        projects = []
    
    features = Features.objects.all()
    
    return render(request, 'index.html', {
        'features': features,
        'projects': projects
    })
def register(request):
    if request.method=='POST':
       username=request.POST['username']
       email=request.POST['email']
       password=request.POST['password']
       password2=request.POST['password2']
       if password==password2:
          if User.objects.filter(email=email).exists():
             messages.info(request,'Email already used')
             return redirect('register')
          elif User.objects.filter(username=username).exists():
                messages.info(request,'Username already used')
                return redirect('register')
          else:
             user=User.objects.create_user(username=username,password=password,email=email)
             user.save()
             return redirect('login')
       else:
          messages.info(request,'Password not matching')
          return redirect('register')
            
    else:
     return render(request,'register.html')

    # return HttpResponse('<h1> Hey , welcome here </h1>')
   # return render(request,'index.html')
 # name='john'  return render(request,'index.html', 'name': name) name is key and name is variable 
def counter(request):
   # text=request.POST['text']
   # wordsCount=len(text.split())
   # return render(request,'counter.html',{'count':wordsCount})
   posts=['hey','hi','hello','welcome']
   return render(request,'counter.html',{'posts':posts})

def login(request):
   if request.method=='POST':
      username=request.POST['username']
      password=request.POST['password']
      user=auth.authenticate(username=username,password=password)
      if user is not None :
         auth.login(request,user)
         return redirect('index')
      else:
         messages.info(request,'Invalid credentials')
         return redirect('login')
   else:
      return render(request,'login.html')
def logout(request):
   auth.logout(request)
   return redirect('index')
def post(request,pk):
   return render(request,'post.html',{'pk':pk})

@csrf_exempt
def update_project(request, project_id):
    """
    Update an existing project via AJAX
    """
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'Authentication required'})
        
        try:
            project = get_object_or_404(Project, id=project_id, user=request.user)
            
            # Update project fields
            project.title = request.POST.get('title', project.title)
            project.description = request.POST.get('description', project.description)
            project.status = request.POST.get('status', project.status)
            project.difficulty = request.POST.get('difficulty', project.difficulty)
            project.priority = request.POST.get('priority', project.priority)
            project.github_url = request.POST.get('github', project.github_url)
            project.deployment_url = request.POST.get('deployment', project.deployment_url)
            project.save()
            
            # Update tech stack
            TechStack.objects.filter(project=project).delete()  # Remove existing tech stack
            tech_stack = request.POST.getlist('tech_stack')
            for tech in tech_stack:
                if tech.strip():
                    TechStack.objects.create(project=project, name=tech.strip())
            
            return JsonResponse({'success': True, 'message': 'Project updated successfully'})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error updating project: {str(e)}'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def delete_project(request, project_id):
    """
    Delete a project via AJAX
    """
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'Authentication required'})
        
        try:
            project = get_object_or_404(Project, id=project_id, user=request.user)
            project.delete()
            return JsonResponse({'success': True, 'message': 'Project deleted successfully'})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error deleting project: {str(e)}'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})
