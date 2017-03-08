CREATE TABLE apartments_test
(
booli_id 				text,
address 				text,
distance_to_ocean 		double precision,
areas 					text,
lon 					double precision,
lat 					double precision,
room 					double precision,
floor 					double precision,
sqm 					double precision,
listprice 				double precision,
price_up 				double precision,
sold_price 				double precision,
rent 					double precision,
construction_year 		double precision,
object_type 			text,
broker 					text,
broker_id 				text,
broker_type 			text,
avg_time_to_central 	double precision,
min_time_to_central 	double precision,
max_time_to_central 	double precision,
avg_commuting_walk_distance double precision,
min_commuting_walk_distance double precision,
max_commuting_walk_distance double precision,
avg_commuting_departures_per_hour double precision
)


insert into apartments_test(
booli_id,
address,
distance_to_ocean,
areas,
lon,
lat,
room,
floor,
sqm,
listprice,
price_up,
sold_price,
rent,
construction_year,
object_type,
broker,
broker_id,
broker_type,
avg_time_to_central,
min_time_to_central,
max_time_to_central,
avg_commuting_walk_distance,
min_commuting_walk_distance,
max_commuting_walk_distance,
avg_commuting_departures_per_hour
)
values(
2235037,
'Sankt Eriksgatan 71',
2243,
'Vasastan',
18.03554526,
59.33857006,
2,
1,
56,
4250000,
650000,
4900000,
2551,
1930,
'Lägenhet',
'Notar',
1566,
'Broker',
10,
232,
37.5,
'10',
'10',
232,
232 
)