# PiSense

*Made for use with Raspberry Pi Zero W and the [DHT22 temperature and humidity sensor](https://www.amazon.com/gp/product/B073F472JL/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)*. PiSense monitors the temperature and humidity of a room and alerts you by text when a temperature goes out of range. Includes a web interface to check temp and humidity any time via web browser.

## Requirements

- Redis (production only for storing sessions)
- Postgres (production only)
- NodeJS
- Python 3
- Nginx (you can use Apache but your on your own for a config file if you do)
- A Twilio account (PiSense uses Twilio to send SMS alerts. You'll have to edit `system/monitor.py` to remove the SMS alert portion of the code or change it to use something like Amazon SNS)

## Installation & Deployment

### Physically setting up the GPIO pins and connecting the sensor

You'll need to connect the hardware yourself but once you're set up with a Raspberry Pi or Raspberry Pi Zero W you can follow along here. You'll need to install GPIO pins yourself if using a Raspberry Pi Zero. All other RasPis have them pre-inserted. There are solderless kits on Amazon but I used a normal one. You can get a pack of 10 2x20 pin GPIO pins on Amazon and some Pi Zero packages come with them included. The DHT22 temperature and humidity sensor I linked to above comes with female to female jumper wires that are easy to install on the 3.3v, ground, and GPIO 4 pins on the Pi. Doing that stuff is up to you.

__Pro tip:__ When I deploy this to any Pi I make sure I create a separate branch off of master that way I can always merge in generic updates from master into my deploy branch without overwriting or publishing my custom configuration options.

### Setup on the production machine (your Pi)

Don't be discouraged if some of the packages take a while to install, especially on the Raspberry Pi Zero which is what this project targets (but will run on any Raspberry Pi).

1. Make sure Python3 and pip3 are installed. Use the Python 3 instructions [included here with the DHT22 sensor library installation instructions](https://github.com/adafruit/Adafruit_Python_DHT) to install all the Python libraries you need for the sensor readings.
2. Now we install Postgres and the Psycopg2 library which will be what we use to save the temperature readings to a database for the web application to display. Run `sudo apt-get install postgresql libpq-dev postgresql-client postgresql-client-common`
3. Before we get to the Psycopg2 library we're going to set up a database to work with both the monitor script and the Node web app. [Use this guide to create all the users and databases you need](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04) with PiSense. Be sure to take note of the username, password, and database name you created. Do not create any tables in your database. The Node app will create the tables when you run migrations.
4. Install Psycopg2 with `sudo pip3 install Psycopg2`
5. SMS alerts are powered by Twilio so you'll need a Twilio account and the Twilio library on your Pi for the monitor script to run. Get a Twilio account and install the Twilio library with `sudo pip3 install twilio`
6. Now you need to make sure Node.js is installed. I would use the same version on both the server and your local machine. I'm using 10.16.0 and I'm using nvm to manage the installation. You can [install nvm here](https://github.com/nvm-sh/nvm) and then get the version of Node you want. Be sure to run `source .bashrc` when you're done so nvm is picked up and you can use the command.
7. Run `nvm install 10.16.0` to get the version of Node that PiSense was developed for (or replace the version number with whatever you like if you know what you're doing)
8. In order to deploy your application you'll need a git repository to deploy from. It can be on the Raspberry Pi itself or GitHub. I __strongly recommend__ you use a private repository for this. I personally have a second git remote where I push a `deploy` branch and this is where the deploy script gets the latest code from the deploy the app. Create a private branch somewhere that your Pi can talk to over the internet however you want and note the remote host and path. You'll need this later when you update the configuration on your local copy.
9. Install the required Node modules globally on the Pi: `npm install -g knex pm2`
10. Install nginx with `sudo apt-get install nginx`. Be sure to create the directory structure you want to host PiSense and remove the default site once you've finished making sure nginx is up and running. We'll cover creating a site conf file for PiSense later.
11. Install and configure Redis. Redis is used for handling session storage. You have to log into the app because if you leave it accessible on the web anyone can get access to the temperature and humidity of your room which doesn't seem like a big deal but the app is built to be privacy conscious by default. [Here is a nice tutorial that'll work on the Pi](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)
12. If you want to be able to access PiSense over the internet not just on your own local home network, follow [this guide and visit the links for full instructions on how to access your Pi over the internet without port forwarding](http://billpatrianakos.me/blog/2019/07/12/access-a-raspberry-pi-from-anywhere-without-port-forwarding/)
13. That's it for the Pi. Now we have to get our local machine set up.

### Deploying from your local computer

1. `cd pisense` to enter the project folder.
2. Install the required Node packages with `npm install -g pm2 knex gulp-cli && npm install`
3. To run the app locally you'll want to run database migrations and seeds. Do so with `knex migrate:latest && knex seed:run`. If you just want to deploy the app then this is optional. Run the app with `gulp` and visit http://localhost:9000.
4. To deploy to production, push your copy of the repository somewhere safe (where you can allow your configuration files to remain private). I use a private GitHub repo or host a copy of the repo on the Pi itself.
5. Run `cp ecosystem.config.js.example ecosystem.config.js`
6. Edit the following config files to suit your situation: `ecosystem.config.js`, `system/pisense.conf`, `system/config.ini`, `server/config/application.js`. `ecosystem.config.js` is your deploy settings script. `system/pisense.conf` is your Nginx site config. We'll copy this somewhere special later. `system/config.ini` is the config file that the Python monitoring script uses to connect to the database and connect to the Twilio API. `server/config/application.js` is what controls everything from the default username and password the production database is seeded with to your initial min/max temperature settings and when alerts should be sent. The `production` object is what you'll want to focus on. Read the options in `application.js` carefully, line by line, before deploying.
7. Now it's time to deploy the site. Run `pm2 setup ecosystem.config.js setup`. PM2 will create a few directories in your site's root folder which is where your site will actually run from.
8. Now you can deploy with `pm2 deploy ecosystem.config.js production`
9. After your first deploy log into your server and run the following commands:
	- `cp /path/to/your_site/current/system/pisense.conf /etc/nginx/sites-available/name_of_your_site.conf`
	- `sudo ln -s /etc/nginx/sites-available/name_of_your_site.conf /etc/nginx/sites-enabled/name_of_your_site.conf`
	- `cd /var/www/path/to/your/site/current && NODE_ENV=production knex seed:run`
10. That should be it. From here on out it's just troubleshooting. This should have been straightforward if you're used to deploying any Node Express or Ruby Rails or Rack site. If not you'll likely need some help but everything you need to know that isn't covered here is just a Google search away. Feel free to open an issue if something in these instructions is definitely not working.
