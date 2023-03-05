import pandas as pd

# Read CSV file into a pandas DataFrame
df = pd.read_csv('testing2.csv')

# df.fillna(0, inplace=True)

# # group the data by country and sum the 'Data' column
# grouped_df = df.groupby(["location", "vaccine"])["location", "vaccine", "total_vaccinations"].max()

# print(grouped_df)
# # grouped_df.to_json('updated-covid.json', orient='table')
# # # Write DataFrame back to CSV file
# grouped_df.to_csv('testing2.csv', index=False)
# df.fillna(0, inplace=True)
columns= list(set(df['vaccine']))
pivoted = df.pivot_table(index="location", columns="vaccine", values="total_vaccinations", fill_value=0)
pivoted = pivoted[columns]

# print(unique_values)
# Rename the columns to match the desired output format
# pivoted.columns = ['Sinopharm/Beijing', 'Sinovac', 'Pfizer/BioNTech', 'Valneva', 'CanSino', 'Novavax', 'Johnson&Johnson', 'Sanofi/GSK', 'Medicago', 'SKYCovione', 'Sputnik V', 'Oxford/AstraZeneca', 'Moderna', 'Covaxin']
# # Reset the index to turn the "location" column into a regular column
pivoted = pivoted.reset_index()

# pivoted.fillna(0, inplace=True)
# # Print the result
print(pivoted)
pivoted.to_csv('stack.csv', index=False)