import pandas as pd

# Read CSV file into a pandas DataFrame
df = pd.read_csv('owid-covid-data.csv')

df.fillna(0, inplace=True)

# group the data by country and sum the 'Data' column
grouped_df = df.groupby('location')['total_cases', 'total_deaths', 'total_tests', 'total_vaccinations', 'people_vaccinated', 'people_fully_vaccinated', 'total_boosters', 'iso_code', 'continent'].max()

grouped_df.to_json('updated-covid.json', orient='table')
# Write DataFrame back to CSV file
grouped_df.to_csv('covid-data.csv', index=False)