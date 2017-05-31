library(readr)
library(ggplot2)
dataset <- read_csv('~/play/matterjs/data/youth-overpopulation-dieoff.csv')

plot(dataset$age[1:10000], dataset$position[1:10000])
