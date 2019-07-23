#!/usr/bin/python3

import sys
import Adafruit_DHT
import configparser
import psycopg2
import datetime
from datetime import timedelta

currentDatetime = datetime.datetime.now()
print("Monitoring temperature and humidity at %s" % str(currentDatetime))

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

##
# Connect to database
##

# Read config file to connect to database first
parser = configparser.ConfigParser()
parser.read('database.ini')

db={}
if parser.has_section('postgresql'):
    params = parser.items('postgresql')
    for param in params:
        db[param[0]] = param[1]
else:
    raise Exception('Section {0} not found in the {1} file'.format('postgresql', 'database.ini'))

# Connect to Postgres and get settings
connection = None
try:
    connection = psycopg2.connect(**db)
    cursor = connection.cursor()
    settings_query = "SELECT * FROM settings ORDER BY id DESC LIMIT 1"
    cursor.execute(settings_query)
    settings = cursor.fetchone()
    cursor.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
    sys.exit(1)
finally:
    if connection is not None:
        connection.close()

# Determine if alert should be sent
today = datetime.datetime.now()
alert_hour_start = settings[1]
alert_hour_end = settings[2]
alert_minute_start = settings[3]
alert_minute_end = settings[4]
max_temp = settings[5]
min_temp = settings[6]
alert_start = datetime.datetime.strptime("{today.year}-{today.month}-{today.day} {alert_hour_start}:{alert_minute_start}".format(**locals()), '%Y-%m-%d %H:%M')
alert_end = datetime.datetime.strptime("{today.year}-{today.month}-{today.day} {alert_hour_end}:{alert_minute_end}".format(**locals()), '%Y-%m-%d %H:%M')
alerted = False
first_run = False

# Make sure alert end uses the correct day
if alert_hour_end < alert_hour_start:
    alert_end = alert_end + timedelta(days=1)

# Check if we are within the alert window and if we need to send an alert
if (currentDatetime > alert_start and currentDatetime < alert_end) and (temperature > max_temp or temperature < min_temp):
    # Check if an alert went out in the last 10 minutes
    try:
        connection = psycopg2.connect(**db)
        cursor = connection.cursor()
        latest_alert_query = "SELECT * FROM readings WHERE alerted ORDER BY id DESC LIMIT 1"
        cursor.execute(latest_alert_query)
        latest_alert = cursor.fetchone()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        sys.exit(1)
    finally:
        if connection is not None:
            connection.close()
    if latest_alert is not None:
        last_alert_time = latest_alert[4]
        time_since_alert = currentDatetime - last_alert_time
    else:
        first_run = True
    # Check if latest alert was within last 10 minutes
    if first_run or time_since_alert.seconds > 600:
        alerted = True
        # code for sending text alert here

# Save the readings to the database
connection = None
try:
    connection = psycopg2.connect(**db)
    cursor = connection.cursor()
    insert_reading_query = "INSERT INTO readings(id, temperature, humidity, alerted, created_at, updated_at) VALUES(DEFAULT, %s, %s, %s, %s, %s)"
    cursor.execute(insert_reading_query, (temperature, humidity, alerted, currentDatetime, currentDatetime))
    connection.commit()
    cursor.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
    sys.exit(1)
finally:
    if connection is not None:
        connection.close()
