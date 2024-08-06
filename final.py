import os
import serial
import tkinter as tk
from PIL import Image, ImageTk
import requests
import time

# Get the absolute path to the current directory
current_dir = os.path.dirname(__file__)

# Define absolute paths for images
happy_image_path = os.path.join(current_dir, "happyface1.png")
sad_image_path = os.path.join(current_dir, "sadface.png")

# Rest of your script remains unchanged...

# Define the serial port and baud rate
port = '/dev/ttyACM0'  # Change this to the correct port for your device
baud_rate = 9600  # Change this to the baud rate of your device

# Initialize the serial connection
ser = serial.Serial(port, baud_rate, timeout=1)

# Check if the connection is open
if ser.isOpen():
    print("Serial connection established successfully.")
else:
    print("Failed to establish serial connection.")

# Create a Tkinter window
window = tk.Tk()
window.title("Radar Data Display")
window.attributes("-fullscreen", True)  # Make the window fullscreen

# Load images for happy and sad faces
happy_image = Image.open(happy_image_path).resize((550, 550), Image.ANTIALIAS)
happy_photo = ImageTk.PhotoImage(happy_image)

sad_image = Image.open(sad_image_path).resize((550, 550), Image.ANTIALIAS)
sad_photo = ImageTk.PhotoImage(sad_image)

# Create frames for left and right sections
speed_frame = tk.Frame(window)
speed_frame.pack(side=tk.LEFT, expand=True, fill=tk.BOTH)

emoji_frame = tk.Frame(window)
emoji_frame.pack(side=tk.RIGHT, expand=True, fill=tk.BOTH)

# Create labels for speed and emoji in respective frames
speed_label = tk.Label(speed_frame, text="0", font=("Arial Black", 550))
speed_label.pack(expand=True, pady=50)  # Add padding to separate from emoji

emoji_label = tk.Label(emoji_frame, image=happy_photo)
emoji_label.pack(expand=True)

# ThingSpeak API parameters
THINGSPEAK_API_KEY = 'ONF0P9WIPWH2TLEB'  # Replace with your ThingSpeak API key
THINGSPEAK_URL = 'https://api.thingspeak.com/update'

# Function to send data to ThingSpeak
def send_to_thingspeak(speed):
    try:
        response = requests.post(THINGSPEAK_URL, data={
            'api_key': THINGSPEAK_API_KEY,
            'field1': speed
        })
        if response.status_code == 200:
            print(f"Data sent to ThingSpeak successfully: {speed}")
        else:
            print(f"Failed to send data to ThingSpeak. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error sending data to ThingSpeak: {e}")

# Define speed limit
speed_limit = 25 # Speed limit (in km/h or mph)

# Initialize last ThingSpeak update time
last_thingspeak_update = time.time()

# Function to update the displayed data
def update_data():
    global last_thingspeak_update
    
    try:
        data = ser.readline().decode().strip()  # Decode bytes to string and remove leading/trailing whitespace
        if data:
            velocity_mps = abs(float(data) * (4.5))

            # Update speed label
            speed_label.config(text=f"{int(velocity_mps)}")

            # Show happy face image if within limit
            if velocity_mps <= speed_limit:
                emoji_label.config(image=happy_photo)
            # Show sad face image if exceeding limit
            else:
                emoji_label.config(image=sad_photo)
                
                # Throttle ThingSpeak updates
                if time.time() - last_thingspeak_update >= 10:  # Update every 10 seconds
                   send_to_thingspeak(int(velocity_mps))
                   last_thingspeak_update = time.time()

    except ValueError:
        print("Invalid data received:", data)
    except Exception as e:
        print("Error:", e)

    # Schedule the next update
    window.after(100, update_data)


# Call the update_data function to start displaying data
update_data()

# Run the Tkinter event loop
window.mainloop()

# Remember to close the serial connection when you're done
ser.close()
