# Project Vault

A Django-based project management application that helps you organize and track your project ideas, with both authenticated user accounts and demo mode functionality.

## Features

### 🎯 **Project Management**
- Create, edit, and delete projects
- Track project status (Idea, Planning, In Progress, Completed)
- Set difficulty levels (Easy, Medium, Hard)
- Assign priority levels (Low, Medium, High)
- Add tech stack information
- Include GitHub and deployment URLs

### 🔐 **User Authentication**
- User registration with email validation
- Secure login/logout functionality
- Password strength validation
- User-specific project storage

### 🎮 **Demo Mode**
- Try the application without creating an account
- Create one project to test all features
- Clear demo limit messaging when trying to create multiple projects
- Automatic cleanup of old demo projects

### 🎨 **Modern UI**
- Responsive design with Tailwind CSS
- Dark/light theme support
- Interactive modals and forms
- Real-time filtering and search
- Project statistics dashboard

## Installation

### Prerequisites
- Python 3.8+
- pip (Python package installer)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mysite
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install django psycopg2-binary python-dotenv
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   - Open your browser and go to `http://127.0.0.1:8000/`

## Usage

### For New Users (Demo Mode)
1. Visit the homepage
2. Click "New Project" to create your first project
3. Fill in project details and save
4. Try editing or deleting your project
5. When you try to create a second project, you'll see the demo limit message
6. Create an account to save unlimited projects!

### For Registered Users
1. Register a new account or sign in
2. Create unlimited projects
3. All your projects are saved and accessible across sessions
4. Use filters and search to organize your projects

## Project Structure

```
mysite/
├── manage.py                 # Django management script
├── db.sqlite3               # SQLite database
├── myapp/                   # Main application
│   ├── models.py           # Database models
│   ├── views.py            # View functions
│   ├── urls.py             # URL routing
│   ├── admin.py            # Admin interface
│   └── migrations/         # Database migrations
├── mysite/                 # Django project settings
│   ├── settings.py        # Project settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
├── templates/             # HTML templates
│   └── index.html         # Main page template
├── static/                # Static files
│   └── assets/
│       ├── main.css       # Styles
│       └── main.js        # JavaScript functionality
└── myenv/                 # Virtual environment
```

## Models

### Project Model
- **title**: Project name
- **description**: Project description
- **status**: Current project status
- **difficulty**: Project difficulty level
- **priority**: Project priority level
- **github_url**: GitHub repository link
- **deployment_url**: Live demo link
- **user**: Associated user (null for demo projects)
- **created_at**: Creation timestamp
- **updated_at**: Last modification timestamp

### TechStack Model
- **project**: Associated project
- **name**: Technology name

## Key Features Explained

### Demo Mode Logic
- Demo users can create exactly 1 project
- When they try to create a second project, they see a modal with account creation options
- After deleting their project, they can create a new one
- Demo projects are automatically cleaned up after 1 hour

### Authentication System
- Email format validation using regex
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character

### Project Management
- AJAX-powered project updates and deletions
- Real-time filtering by status, difficulty, and technology
- Search functionality across project titles and descriptions
- Project statistics dashboard

## API Endpoints

- `GET /` - Homepage with project list
- `POST /` - Create new project
- `POST /update-project/<id>/` - Update existing project
- `POST /delete-project/<id>/` - Delete project
- `GET /register` - User registration page
- `POST /register` - Process registration
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /logout` - Logout user

## Customization

### Adding New Project Fields
1. Update the `Project` model in `myapp/models.py`
2. Run `python manage.py makemigrations`
3. Run `python manage.py migrate`
4. Update the form in `templates/index.html`
5. Update the JavaScript in `static/assets/main.js`

### Styling Changes
- Modify `static/assets/main.css` for styling changes
- Update `templates/index.html` for layout modifications
- JavaScript functionality is in `static/assets/main.js`

## Database

The application uses SQLite by default, but can be configured for PostgreSQL:

```python
# In settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Deployment

### Production Settings
1. Set `DEBUG = False` in settings.py
2. Configure `ALLOWED_HOSTS`
3. Set up proper database (PostgreSQL recommended)
4. Configure static file serving
5. Use environment variables for sensitive data

### Environment Variables
Create a `.env` file:
```
SECRET_KEY=your-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on the repository or contact the development team.

---

**Happy Project Managing! 🚀**
