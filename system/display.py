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

tm = tm1637.TM1637(clk=5, dio=4)

now = datetime.datetime.now()
if now.hour >= 1 && now.hour <= 4:
    # lowest brightness
    tm.brightness(0)
elif now.hour > 4 && now.hour <= 6:
    # medium brightness
    tm.brightness(3)
elif now.hour >= 7 && now.hour <= 10:
    # high brightness
    tm.brightness(7)
elif now.hour > 10 && now.hour < 17:
    # medium high
    tm.brightness(5)
elif now.hour > 17 && now.hour <= 19:
    # medium brightness
    tm.brightness(4)
else:
    # low brightness
    tm.brightness(0)

temp = int(temperature)
hum = int(humidity)

# Run the display
for i in xrange(1,6):
    tm.numbers(temp, hum)
    sleep(10)
    if hum < 40:
        tm.scroll('LOW HUMIdIty')
        sleep(10)
    elif hum > 40 && hum < 55:
        tm.scroll('GOOd HUMIdIty')
        sleep(10)
    elif hum > 55:
        tm.scroll('tOO HIGH HUMIdIty')
        sleep(10)
    else:
        tm.scroll('ErrOr')
        sleep(10)
