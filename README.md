# PiSense

*Made for use with Raspberry Pi Zero W and the [DHT22 temperature and humidity sensor](https://www.amazon.com/gp/product/B073F472JL/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)*. PiSense monitors the temperature and humidity of a room and alerts you by text when a temperature goes out of range. Includes a web interface to check temp and humidity any time via web browser.

## Requirements

- Redis (production only for storing sessions)
- Postgres (production only)
- NodeJS
- Python 3
- Nginx (you can use Apache but your on your own for a config file if you do)

## Installation & Deployment

You'll need to connect the hardware yourself but once you're set up...

1. __[PRODUCTION ONLY]__ Install the Python package for interfacing with the sensor on your Raspberry Pi using the [instructions found here](https://github.com/adafruit/Adafruit_Python_DHT)
2. __[PRODUCTION ONLY]__ Make sure you have a new Postgres database ready for the application to use __on the server__. SQLite3 is used in development and no Postgres databases are needed there.
3. __[DEVELOPMENT ONLY]__ Run `npm install -g gulp-cli knex pm2 && npm install`
4. __[PRODUCTION ONLY]__ Run `npm install -g knex`
4. Update the following config files: `server/config/application.js`, `system/pisense.conf`, `system/database.ini`
5. PRODUCTION - Install psycopg, twilio
