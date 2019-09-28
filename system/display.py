#!/usr/bin/python3

# Script to write temperature and humidity to
# a tm1637 7 segment display.
# Meant to run as a cron job every few minutes

import sys
import Adafruit_DHT
import datetime
import tm1637 # raspberrypi-python-tm1637
from time import sleep

currentDatetime = datetime.datetime.now()
print("Displaying temperature and humidity at %s" % str(currentDatetime))

# Parse command line parameters.
sensor_args = { '11': Adafruit_DHT.DHT11,
                '22': Adafruit_DHT.DHT22,
                '2302': Adafruit_DHT.AM2302 }
if len(sys.argv) == 3 and sys.argv[1] in sensor_args:
    sensor = sensor_args[sys.argv[1]]
    pin = sys.argv[2]
else:
    print('Usage: sudo ./Adafruit_DHT.py [11|22|2302] <GPIO pin number>')
    print('Example: sudo ./Adafruit_DHT.py 2302 4 - Read from an AM2302 connected to GPIO pin #4')
    sys.exit(1)

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

# Un-comment the line below to convert the temperature to Fahrenheit.
temperature = temperature * 9/5.0 + 32

# Note that sometimes you won't get a reading and
# the results will be null (because Linux can't
# guarantee the timing of calls to read the sensor).
# If this happens try again!
if humidity is None and temperature is None:
    print('Failed to get reading. Try again!')
    sys.exit(1)

# Start running the display
def determine_appropriate_brightness(hour):
    if hour >= 1 and hour <= 4:
        # lowest brightness
        return 0
    elif hour >= 5 and hour <= 6:
        # medium brightness
        return 3
    elif hour >= 7 and hour <= 13:
        # high brightness
        return 7
    elif hour >= 14 and hour <= 17:
        # medium high
        return 5
    elif hour >= 18 and hour <= 19:
        # medium brightness
        return 4
    else:
        # low brightness
        return 0

tm = tm1637.TM1637(clk=9, dio=10)
now = datetime.datetime.now()
temp = int(temperature)
hum = int(humidity)

# Set display brightness
brightness_level = determine_appropriate_brightness(now.hour)
tm.brightness(brightness_level)

# Cycle between reading and message
run_cycle = True
i = 0
while run_cycle:
    tm.numbers(temp, hum)
    sleep(5)
    if hum < 40:
        tm.scroll('LOW HUMIdIty')
    elif hum > 40 and hum < 55:
        tm.scroll('GOOd HUMIdIty')
    elif hum >= 55:
        tm.scroll('tOO HIGH HUMIdIty')
    else:
        tm.scroll('ErrOr')
    tm.numbers(temp, hum)
    sleep(4)
    i += 1
    # Runs it for about 1 minute
    if i >= 6:
        run_cycle = False
