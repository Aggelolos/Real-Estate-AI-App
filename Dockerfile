# 1. Use an official Python runtime as a parent image
FROM python:3.13-slim

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy the packing list we just made
COPY requirements.txt .

# 4. Install the necessary packages
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy your entire Django project into the container
COPY . .

# 6. Expose the port Django runs on
EXPOSE 8000

# 7. Command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]