# AccliMate (a Social Weather App)

- [General info](#general-info)
- [Technologies](#technologies)
- [Milestones](#Milestones)
- [Contents](#content)

## General Info

This browser-based web application exists to let users:
- report/verify weather conditions in their area
- view their local weather forecast
- connect with other users 
- share useful information re: current conditions via text and photos

This COMP 2800 App Project is being developed by Andrew Chu, Jason Lee, Code Workun, and Waleed Ur Rehman

## Technologies

Technologies used for this project include:

- HTML, CSS
- JavaScript
- Node.js
- JQuery
- MySQL
- Geolocation APi
- Google Maps API
- OpenWeather API

## YO ANDREW

## Milestones

Milestone #1:
- Structured project files
- Designed html template
- Created log-in, admin/user dashboards
- Implemented session-handling
- Unified design across functional html pages

## Contents

```
Top level of project folder:

├── apps
    ├── /html
        /login.html             # Site root; log-in page
        /admin_dashboard.html   # 'Admin' landing page after successful log-in
        /user-dashboard.html    # 'User' landing page after successful log-in
        /template.html          # template for future html pages
    ├── /profileimages          # contains user submitted images

    ├── /scripts                # To contain any js templates and/or user generated scripts. 
        
    ├── /text                   # contains HTML templates for the application.
        /footer.html            
        /nav.html  
        /weather.html
├── /cert                   # contains self signed SSL certificate
    /cert.pem  
    /csr.pem
    /key.pem
    
    
├── node_modules                # required node modules

├── public                      # Folder for images, scripts, and stylesheets
    ├── /images                 # Subolder for images
        /bbymap.jpg
        /bbymap2.jpg
        /forecast.jpeg
        /loginbg.svg
        /smiley.jpg
        ├── /favicon            # Subfolder for favicons
            /android-chrome-192x192.png
            /android-chrome-512x512.png
            /apple-touch-icon.png
            /favicon-16x16.png
            /favicon-32x32.png
            /favicon.ico
            /site.webmanifest   
    ├── /scripts                # Subfolder for scripts
        /admin-dashboard.js
        /location.js
        /rain.js
        /signup.js
        /skeleton.js
        /upload-profile-pic.js
        /upload.js
        /user-dashboard.js
        /user-profile.js
        /weather.js
    ├── /sql                    # Subfolder for sql 
        /config.sql
    ├── /styles                 # Subfolder for styles
        /admin-style.css
        /construction.css
        /login.css
        /profile.css
        /style.css
        /upload.css
        /user-style.css
        

├── .gitignore                  # Git ignore file

├── package-lock.json

├──package.json

├── Procfile

├── README.md

├── readme.txt                   #

├── server.js                    # script to initialize web app (node server.js from CLI)
