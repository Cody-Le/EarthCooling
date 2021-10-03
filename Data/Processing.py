import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


co2 = pd.read_csv("annual-co2-emissions-per-country.csv")
ocean = pd.read_csv("WaterLevel.csv")
years = np.unique(co2['Year'].to_numpy())
matrixYear = np.zeros((years.size, 3))
for i, year in enumerate(years):
    matrixYear[i] = [year, np.sum(co2.loc[co2['Year'] == year].iloc[:,-1]), 0]
print(ocean.iloc[:, 2].to_numpy().astype("int32"))
print(ocean)
#print(matrixYear)
usableIndex = []
for i, year in enumerate(ocean.iloc[:, 2].to_numpy().astype("int32")):
    try:
        usableIndex.append(np.where(matrixYear[:,0] == year)[0][0])
        matrixYear[np.where(matrixYear[:,0] == year)[0][0], -1] += ocean.iloc[i, -1]
        print(year, ocean.iloc[i, -1])
    except:
        pass

usableIndexes = np.unique(np.array(usableIndex))
matrixYea = matrixYear[usableIndexes, :]
m = np.polyfit(matrixYea[:,1]/1e9, matrixYea[:,2],2)
print(m)
def applyFunction(input, theta):
    print(input)
    return theta[0] * input ** 2 + theta[1] * input + theta[2]



print(np.max(matrixYea, axis = 0))
plt.subplot(1,1,1)
plt.plot(matrixYea[:,1]/1e9,matrixYea[:,2], label = "Actual")
plt.plot(matrixYea[:,1]/1e9,applyFunction(matrixYea[:,1]/1e9, m), label = "Estimate")
plt.ylabel("Rise in sea level in mm")
plt.xlabel("CO2 Emission Globally in Giga Tons")
plt.legend()
#plt.plot(matrixYea[:,0], matrixYea[:,2])
plt.show()