# Setup with a reverse proxy

First install and run the NGINX package.

```
sudo apt-get install nginx
```


### Optional: Setup letsencrypt

If you do not need ssl, skip ahead to setup reverse proxy. If you will use this to power any wallet application with API functionality, it is advised to use SSL.

First, add your domain name into the server configuration located at `/etc/nginx/sites-available/default`.
Find the line where it says `server_name _;` and switch `_` with the name of your domain `e.g. btc.mousebelt.com`.
You can check your configuration with:

```
sudo nginx -t
```

And update nginx with:

```
sudo systemctl reload nginx
```

After that you can run the following to get an SSL certificate with letsencrypt:

```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
sudo certbot --nginx -d optionalsubdomain.example.com
```

### Setup Reverse Proxy 

Setup a reverse proxy by editing the section with `location /` to:

```
location / {
    proxy_pass 127.0.0.1:8080;
}
```

Reload nginx:

```
sudo systemctl reload nginx
```

And you are setup with a reverse proxy of port 80 or 443 to your explorer api.
