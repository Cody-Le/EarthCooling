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

#print(matrixYear)
usableIndex = []
for i, year in enumerate(ocean.iloc[:, 2].to_numpy().astype("int32")):
    try:
        usableIndex.append(np.where(matrixYear[:,0] == year)[0][0])
        matrixYear[np.where(matrixYear[:,0] == year)[0][0], -1] += ocean.iloc[i, -1]
    except:
        pass

usableIndexes = np.unique(np.array(usableIndex))
matrixYea = matrixYear[usableIndexes, :]


plt.subplot(1,2,1)
plt.plot(matrixYea[:,0], matrixYea[:,1])
plt.title("Global CO2 emission")
plt.subplot(1,2,2)
plt.title("Changes in sea level")
plt.plot(matrixYea[:,0], matrixYea[:,2])
plt.show()