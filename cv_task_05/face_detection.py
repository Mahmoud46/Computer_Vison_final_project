import cv2
from random import randint


def apply_face_detection(img_path):
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        './static/xmls/haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
    img_path = f'./static/download/face_detection/face_detection_{randint(0,999999999999999999)}.png'
    cv2.imwrite(img_path, img)
    return img_path
