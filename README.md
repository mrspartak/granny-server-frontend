# Web page for Granny nodejs CDN server

This app helps to setup your mini CDN. Add domains, setup settings and view your files

[![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/assorium/granny-server-web?style=for-the-badge "Docker Cloud Automated build")](https://hub.docker.com/r/assorium/granny-server-web "Docker Cloud Automated build")
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/assorium/granny-server-web?style=for-the-badge "Docker Cloud Build Status")](https://hub.docker.com/r/assorium/granny-server-web "Docker Cloud Build Status")
[![Docker Pulls](https://img.shields.io/docker/pulls/assorium/granny-server-web?style=for-the-badge "Docker Pulls")](https://hub.docker.com/r/assorium/granny-server-web "Docker Pulls")  <br/>

[![Latest Github tag](https://img.shields.io/github/v/tag/mrspartak/granny-server-frontend?sort=date&style=for-the-badge "Latest Github tag")](https://github.com/mrspartak/granny-server-frontend/releases "Latest Github tag")

## Ecosystem
![image](https://user-images.githubusercontent.com/993910/74678258-8f250380-51cb-11ea-9b5e-1640e713380e.PNG)

[granny-server-backend](https://github.com/mrspartak/granny-server-backend "granny-server-backend") - Backend service with API exposed to upload and serve/manipulate images  
[granny-js-client](https://github.com/mrspartak/granny-js-client "granny-js-client") - Client library that works both in nodejs and browser. Makes API calls easier  
[granny-server-frontend](https://github.com/mrspartak/granny-server-frontend "granny-server-frontend") - Frontend APP that uses client to manage your CDN domains and settings  
[granny-server-cron](https://github.com/mrspartak/granny-server-cron "granny-server-cron") - Utility app  

## Requirements
- [Granny backend server running](https://github.com/mrspartak/granny-server-backend)

## Docker install
There is builded vue website inside container with small nginx image to serve. So website is avialable on 80 port and you can easily proxy it with external nginx.
You can also run this as a service and pass --config to it
```
docker run -p 3010:80 --name granny-server-frontend \
  -v /local/path/to/settings.json:/usr/share/nginx/html/cfg/settings.json \
  assorium/granny-server-web:latest
```
Settings file looks like this:
```
{
	"granny_url": "https://path to your granny backend server"
}
```

## Current status
Currently this is in deep beta. I needed this website to setup domains and list files. And there are many things to do. I will definately make them later.
- View files and all modifications
- Setup domains settings. Such as 'save modified images', 'return headers', 'allowed modifications' etc
- Adding users?
- Showing app hardware usage inforamtion

## Screenshots
Adding domain
![image](https://user-images.githubusercontent.com/993910/74448612-4f3ce400-4e8c-11ea-8e87-72fdc899f513.png)

Listing files
![image](https://user-images.githubusercontent.com/993910/74565122-8fca5980-4f81-11ea-936a-9b5523c2bdac.png)

Viewing and manipulating file
![image](https://user-images.githubusercontent.com/993910/74565082-75907b80-4f81-11ea-96e4-e036d1cf9ecb.png)
