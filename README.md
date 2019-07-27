# PiSense

*Made for use with Raspberry Pi Zero W and the [DHT22 temperature and humidity sensor](https://www.amazon.com/gp/product/B073F472JL/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)*. PiSense monitors the temperature and humidity of a room and alerts you by text when a temperature goes out of range. Includes a web interface to check temp and humidity any time via web browser.

## Requirements

- Redis (production only for storing sessions)
- Postgres (production only)
- NodeJS
- Python 3
- Nginx (you can use Apache but your on your own for a config file if you do)

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
10. Install nginx with `sudo apt-get install nginx`.
11. That's it for the Pi. Now we have to get our local machine set up.

### Deploying from your local computer

1. `cd pisense` to enter the project folder.
2. Install the required Node packages with `npm install -g pm2 knex gulp-cli && npm install`
3. To run the app locally you'll want to run database migrations and seeds. Do so with `knex migrate:latest && knex seed:run`. If you just want to deploy the app then this is optional. Run the app with `gulp` and visit http://localhost:9000.
4. To deploy to production, push your copy of the repository somewhere safe (where you can allow your configuration files to remain private). I use a private GitHub repo or host a copy of the repo on the Pi itself.
5. Edit the following configuration files with your custom settings: 

1. __[PRODUCTION ONLY]__ Install the Python package for interfacing with the sensor on your Raspberry Pi using the [instructions found here](https://github.com/adafruit/Adafruit_Python_DHT)
2. __[PRODUCTION ONLY]__ Make sure you have a new Postgres database ready for the application to use __on the server__. SQLite3 is used in development and no Postgres databases are needed there.
3. __[DEVELOPMENT ONLY]__ Run `npm install -g gulp-cli knex pm2 && npm install`
4. __[PRODUCTION ONLY]__ Run `npm install -g knex`
4. Update the following config files: `server/config/application.js`, `system/pisense.conf`, `system/database.ini`
5. PRODUCTION - Install psycopg, twilio
