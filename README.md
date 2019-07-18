# PiSense

*Made for use with Raspberry Pi Zero W and the [DHT22 temperature and humidity sensor](https://www.amazon.com/gp/product/B073F472JL/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)*. PiSense monitors the temperature and humidity of a room and alerts you by text when a temperature goes out of range. Includes a web interface to check temp and humidity any time via web browser.

## Requirements

- Redis (production only for storing sessions)
- Postgres (production only)
- NodeJS
- Python 2 or 3 (the monitor script was written with Python 3 in mind)

## Installation & Deployment

You'll need to connect the hardware yourself but once you're set up...

1. Install the Python package for interfacing with the sensor on your Raspberry Pi using the [instructions found here](https://github.com/adafruit/Adafruit_Python_DHT)
2. Make sure you have a new Postgres database ready for the application to use __on the server__. SQLite3 is used in development and no Postgres databases are needed there.
3. __[DEVELOPMENT ONLY]__ Run `npm install -g gulp-cli knex && npm install`
4. 