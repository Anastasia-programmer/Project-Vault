from django.shortcuts import render,redirect, get_object_or_404
from .models import Features, Project, TechStack
from django.contrib.auth.models import User,auth
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re

# Create your views here.

def validate_email_format(email):
    """
    Validate email format using regex
    """
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return False, "Please enter a valid email address"
    
    # Additional checks
    if len(email) > 254:  # RFC 5321 limit
        return False, "Email address is too long"
    
    if email.count('@') != 1:
        return False, "Email must contain exactly one @ symbol"
    
    local_part, domain = email.split('@')
    if len(local_part) > 64:  # RFC 5321 limit
        return False, "Email local part is too long"
    
    if not domain or '.' not in domain:
        return False, "Please enter a valid email address"
    
    return True, "Valid email address"

def validate_password_strength(password):
    """
    Validate password strength with the following criteria:
    - At least 8 characters long
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one digit
    - Contains at least one special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one digit"
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is strong"

def index(request):
    """
    Main page - handles both GET (show page) and POST (create project)
    """
    if request.method == 'POST':
        # Handle form submission (create new project)
        if request.user.is_authenticated:
            # Logged-in users can create unlimited projects
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
            
            return redirect('index')
        else:
            # Demo mode - check if user already has a project
            existing_demo_projects = Project.objects.filter(user__isnull=True).count()
            if existing_demo_projects >= 1:
                messages.info(request, 'Demo mode allows only 1 project. Create an account to save unlimited projects!')
                return redirect('index')
            
            title = request.POST.get('title')
            description = request.POST.get('description')
            status = request.POST.get('status', 'idea')
            difficulty = request.POST.get('difficulty', 'medium')
            priority = request.POST.get('priority', 'medium')
            github_url = request.POST.get('github', '')
            deployment_url = request.POST.get('deployment', '')
            
            # Create the project (demo mode - no user required)
            project = Project.objects.create(
                title=title,
                description=description,
                status=status,
                difficulty=difficulty,
                priority=priority,
                github_url=github_url,
                deployment_url=deployment_url,
                user=None
            )
           
            # Add tech stack items
            tech_stack = request.POST.getlist('tech_stack')
            for tech in tech_stack:
                if tech.strip():  # Only add non-empty tech items
                    TechStack.objects.create(project=project, name=tech.strip())
            
            return redirect('index')
    
    # Handle GET request (show page)
    if request.user.is_authenticated:
        projects = Project.objects.filter(user=request.user).order_by('-created_at')
    else:
        # For demo mode, show projects created by anonymous users
        # Clean up old demo projects (older than 1 hour)
        from django.utils import timezone
        from datetime import timedelta
        cutoff_time = timezone.now() - timedelta(hours=1)
        Project.objects.filter(user__isnull=True, created_at__lt=cutoff_time).delete()
        
        # Get projects created by anonymous users
        projects = Project.objects.filter(user__isnull=True).order_by('-created_at')
    
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
       
       # Validate email format
       is_valid_email, email_message = validate_email_format(email)
       if not is_valid_email:
           messages.error(request, email_message)
           return redirect('register')
       
       # Validate password strength
       is_strong, strength_message = validate_password_strength(password)
       if not is_strong:
           messages.error(request, strength_message)
           return redirect('register')
       
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
             messages.success(request, 'Account created successfully! Please log in.')
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
        try:
            if request.user.is_authenticated:
                # Logged-in user can only update their own projects
                project = get_object_or_404(Project, id=project_id, user=request.user)
            else:
                # Demo mode - can update the single demo project
                project = get_object_or_404(Project, id=project_id, user__isnull=True)
            
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
        try:
            if request.user.is_authenticated:
                # Logged-in user can only delete their own projects
                project = get_object_or_404(Project, id=project_id, user=request.user)
            else:
                # Demo mode - can delete the single demo project
                project = get_object_or_404(Project, id=project_id, user__isnull=True)
            
            project.delete()
            return JsonResponse({'success': True, 'message': 'Project deleted successfully'})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error deleting project: {str(e)}'})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})
