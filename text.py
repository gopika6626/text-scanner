import easyocr
import cv2
from matplotlib import pyplot as plt #imported all the dependencies
import numpy as np
import pyperclip

#we need to read the images or video

# a variable rto store the image file 
IMAGE_PATH = "assets/ghci.jpg"

image = cv2.imread(IMAGE_PATH)


if image is None:
 print("no image file")
else:
   gray_scale = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
   

reader = easyocr.Reader(['en'],gpu=True)
result = reader.readtext(IMAGE_PATH)
print(result)

image = cv2.imread(IMAGE_PATH)

for (bbox,text,prob) in result:
     
     (top_left, top_right, bottom_right, bottom_left) = bbox

     top_left = tuple(map(int,top_left))
     top_right = tuple(map(int,top_right))

     cv2.rectangle(image,top_left,top_right,(255,0,0),2) 
     cv2.putText(image, text, (top_left[0], top_left[1] - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
     

cv2.imshow("exctracted  text", gray_scale) 
cv2.imshow("exctracted  text", image) # Show the grayscale image
cv2.waitKey(0)  # Wait for a key press
cv2.destroyAllWindows()  # Close all OpenCV windows

extracted_text = "\n".join([item[1] for item in result])
pyperclip.copy(extracted_text)


print("Text copied to clipboard!")

