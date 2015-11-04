# Map Data Spike

Assuming we need to iterate over a large data source matching data, what is the most efficient way:
 - In memory
 - Redis - map/reduce via library
 - Mongo - native map/reduce
 - SQL?

Mongo is way slower - 100 * slower than an in memory filter on 1000 records.