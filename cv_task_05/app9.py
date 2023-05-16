import numpy as np
import cv2
from matplotlib import pyplot as plt
from random import randint


def canny(img_path,high_threshold,low_threshold):
    img=cv2.imread(img_path,0)
    gauss = cv2.GaussianBlur(img,(3,3),0)

    Ix=cv2.Sobel(gauss,cv2.CV_64F,1,0)
    Iy=cv2.Sobel(gauss,cv2.CV_64F,0,1)
    sobel= np.sqrt( np.square(Ix) + np.square(Iy))
    theta = np.arctan2(Iy, Ix)

    M, N = sobel.shape
    Z = np.zeros((M,N),dtype=np.int32)
    angle = theta * 180. / np.pi
    angle[angle < 0] += 180
    plt.imshow(sobel,cmap="gray")

    for i in range(1,M-1):
            for j in range(1,N-1):
                    q = 255
                    r = 255
                    
                #angle 0
                    if (0 <= angle[i,j] < 22.5) or (157.5 <= angle[i,j] <= 180):
                        q = sobel[i, j+1]
                        r = sobel[i, j-1]
                    #angle 45
                    elif (22.5 <= angle[i,j] < 67.5):
                        q = sobel[i+1, j-1]
                        r = sobel[i-1, j+1]
                    #angle 90
                    elif (67.5 <= angle[i,j] < 112.5):
                        q = sobel[i+1, j]
                        r = sobel[i-1, j]
                    #angle 135
                    elif (112.5 <= angle[i,j] < 157.5):
                        q = sobel[i-1, j-1]
                        r = sobel[i+1, j+1]

                    if (sobel[i,j] >= q) and (sobel[i,j] >= r):
                        Z[i,j] = sobel[i,j]
                    else:
                        Z[i,j] = 0

    highThreshold=high_threshold
    lowThreshold=low_threshold

    M, N = Z.shape
    res = np.zeros((M,N), dtype=np.int32)

    weak = np.int32(25)
    strong = np.int32(255)

    strong_i, strong_j = np.where(Z >= highThreshold)
    zeros_i, zeros_j = np.where(Z < lowThreshold)

    weak_i, weak_j = np.where((Z <= highThreshold) & (Z >= lowThreshold))

    res[strong_i, strong_j] = strong
    res[weak_i, weak_j] = weak


    strong=255
    M, N = res.shape  
    for i in range(1, M-1):
        for j in range(1, N-1):
            if (res[i,j] == weak):
                try:
                    if ((res[i+1, j-1] == strong) or (res[i+1, j] == strong) or (res[i+1, j+1] == strong)
                        or (res[i, j-1] == strong) or (res[i, j+1] == strong)
                        or (res[i-1, j-1] == strong) or (res[i-1, j] == strong) or (res[i-1, j+1] == strong)):
                        res[i, j] = strong
                    else:
                        res[i, j] = 0
                except IndexError as e:
                    pass

    img_path = f'./static/download/edit/{randint(0,9999999999999999)}_uniform_noise_img.png'
    cv2.imwrite(img_path,res)    

    return img_path
# cv2.waitKey(0)
  
# # closing all open windows
# cv2.destroyAllWindows()