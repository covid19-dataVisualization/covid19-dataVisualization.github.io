import pandas as pd

# Read CSV file into a pandas DataFrame
df = pd.read_csv('new_vaccinated_data_by_age_countries.csv')

# Replace empty values with 0
df.fillna(0, inplace=True)

# Write DataFrame back to CSV file
df.to_csv('new_vaccinated_data_by_age_countries.csv', index=False)