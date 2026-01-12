import { Dive } from './types';

// Increment this when INITIAL_DIVES changes to force an update in App.tsx
export const DATA_VERSION = '1.1'; 

const RAW_CSV = `Date,Location,Site,Buddies,Depth (m),Duration (min),Water temp,Rating,Notes
2016-11-12,Sydney,Malabar,Stef,5,32,19ºC,,Lots of stingrays & car wreck
2016-11-13,Sydney,Bare Island,Stef,10,35,19ºC,,Sting rays and jellies
2016-11-13,Sydney,Bare Island,Stef,7,30,19ºC,,
2016-11-13,Sydney,Bare Island,Stef,9,32,19ºC,,Sea urchins / Blue dragon nudi
2016-11-28,Nusa Lembongan,Manta Point,Stef,16,54,27ºC,,Manta rays / octopus / clown fish
2016-11-28,Nusa Lembongan,Crystal Bay,Stef,16,48,27ºC,,Turtles / Clownfish / Nudis / Tiny frogfish
2016-11-30,Nusa Lembongan,Toya Pakah,Stef,18,44,27ºC,,2 Turtle / Pufferfish / Parotfish / Giant trevally / Trigger fish / Blue spotted puffer fish
2016-11-30,Nusa Lembongan,Sekolah Dasar,Stef,18,48,29ºC,,Turtle / Trumpet fish / Barracuda
2017-01-14,Sydney,Rock Fall,Stef,26,21,-,,Blue Groper / Wobbe
2017-01-14,Sydney,Old Man's Hat,Stef,19,27,-,,Wobbe / Weedy Seadragon
2017-03-13,Tangalooma,Tangalooma Wrecks,Stef,10,33,25ºC,,
2017-03-18,Sydney,Camp Cove,Stef,6,38,22ºC,,Octopus / Cuttlefish / Scorpion fish
2017-03-18,Sydney,Camp Cove,Stef,6,44,22ºC,,
2017-10-15,Sydney,Blue fish point,Stef,19,37,21ºC,,Lots of PJ sharks / Eastern BLue Devil fish / Wobbe / Fiddler Ray / Moray eel / Huge ray at the end
2017-10-15,Sydney,Blue fish wall,Stef,15,39,21ºC,,
2017-11-11,Narooma,Montague Island,Stef,19,37,18ºC,,Lots of seals / blue grouper / pink jelly fish / moray eel
2017-11-11,Narooma,Montague Island,Stef,18,42,18ºC,,
2017-11-12,Narooma,Montague Island,Stef,13,52,18ºC,,Lots of seals / cute starfish / blue groupers / stalking blue grouper / first dive with no guide.
2017-11-12,Narooma,Montague Island,Stef,14,42,18ºC,,
2017-11-25,Sydney,Shelly Beach,,10,59,16ºC,,Lots of wobbe / nudis / cownose ray
2017-11-25,Sydney,Shelly Beach,,8,48,16ºC,,
2018-01-07,Sydney,Gordon's Bay,Stef,13,32,19ºC,,Fiddler ray / lots of other rays / eel tailed catfish
2018-01-07,Sydney,Gordon's Bay,Stef,14,45,19ºC,,
2018-02-03,Sydney,Shelly Beach,Stef,13,47,21ºC,,Wobbe / Small rays / crayfish. Lost guide again.
2018-02-03,Sydney,Shelly Beach,Stef,8,61,21ºC,,First dive over 1hr
2018-02-11,Sydney,Gordon's Bay,"Kasia, Kamil",14,52,19ºC,,
2018-02-11,Sydney,Gordon's Bay,"Kasia, Kamil",11,65,19ºC,,Lots of nudis
2018-02-17,Sydney,Malabar,Stef,4,33,22ºC,,Advanced training / peak buoyancy / Navigation
2018-02-17,Sydney,Malabar,Stef,5,26,22ºC,,
2018-02-17,Sydney,Camp Cove,Stef,5,33,22ºC,,Night Dive training
2018-03-04,Sydney,Gordon's Bay,Stef,12,67,22ºC,,Rough entrance and exit / big cuttle fish / rays / scorpion fish
2018-03-11,Sydney,Bare Island,Ned,13,52,22ºC,,Great vis / 2 cuttle fish / big nudis / weedy sea dragon
2018-03-11,Sydney,Bare Island,Ned,9,58,22ºC,,
2018-03-25,Sydney,Cascades,Stef,26,30,19ºC,,Completing advanced course
2018-03-25,Sydney,Old Man's Hat,Stef,21,30,19ºC,,
2018-04-14,Sydney,Shelly Beach,Stef,11,61,18ºC,,Big eagle ray / found the motor bike / cuttle fish under rocks
2018-04-14,Sydney,Shelly Beach,Stef,7,56,18ºC,,
2018-04-21,Sydney,Shelly Beach,Sebastian,12,39,19ºC,,Lots of cuttle fish
2018-04-21,Sydney,Shelly Beach,Sebastian,7,57,19ºC,,Not much...
2018-04-26,Fiji,Plantation Pinnacle,Stef,23,44,27ºC,,Large pillar rising up in the middle of nowhere / lion fish / lots of nice corals / electric clam / clown fish
2018-04-26,Fiji,Wilkes Passage,Stef,23,49,27ºC,,
2018-04-27,Fiji,Barrel Head,Stef,26,41,27ºC,,Amazing wall about 40m high / white tip / fan corals
2018-04-27,Fiji,Vanu Range,Stef,20,53,27ºC,,3 turtles / huge bommies
2018-04-28,Fiji,Plantation Pinnacle,?,23,53,27ºC,,Lots of lion fish / few small nudis / stone fish / shy puffer fish
2018-04-28,Fiji,Wilkes Passage,?,21,56,27ºC,,Nice coral / moray eels / octopus / clown fish
2018-05-27,Sydney,Bare Island,Sebastian,13,46,17ºC,,
2018-05-27,Sydney,Bare Island,Sebastian,10,55,17ºC,,
2018-06-16,Sydney,Gordon's Bay,Sly,14,49,17ºC,,Big wobbe under rock with lots of small things along the wall. Explored other side of the bay
2018-06-16,Sydney,Gordon's Bay,Sly,11,56,17ºC,,
2018-09-15,Sydney,Bare Island,Sly,9,56,15ºC,,Lota of PJs / excellent vis
2018-09-15,Sydney,Bare Island,Sly,11,44,14ºC,,Cold but colourful
2018-10-20,Sydney,Clifton Gardens,"Kasia, Kamil",11,65,16ºC,,Nudis / sea horses / pipe fish / 
2018-10-20,Sydney,Clifton Gardens,"Kasia, Kamil",13,57,16ºC,,
2018-10-27,Sydney,Gordon's Bay,"Sly, Stef",15,37,19ºC,,New wet suit / Huge wobbe / 4 PJs / few cuttlefish
2018-10-27,Sydney,Gordon's Bay,"Sly, Stef",13,44,19ºC,,
2018-11-25,Sydney,Shelly Beach,"Sly, Stef, Seb",9,60,17ºC,,
2018-11-25,Sydney,Shelly Beach,Sly,12,44,17ºC,,Got lost
2018-12-07,Sydney,South Head,SDC,21,52,18ºC,,Drift dive
2018-12-07,Sydney,Old Man's Hat,SDC,22,40,18ºC,,Didn't follow the chain down. Beautiful viz at old mans hat
2018-12-11,Nusa Lembongan,Sental,Kutlu,23,52,26ºC,,
2018-12-11,Nusa Lembongan,SD,Kutlu,20,52,26ºC,,
2018-12-12,Nusa Lembongan,PMG,Kutlu,19,53,27ºC,,
2018-12-12,Nusa Lembongan,Mangroves,Kutlu,20,52,27ºC,,
2018-12-13,Nusa Lembongan,Karangsari,Kutlu,25,52,28ºC,,
2018-12-13,Nusa Lembongan,Engine Reef,Kutlu,24,51,28ºC,,
2018-12-14,Nusa Lembongan,Manta Point,Kutlu,30,52,27ºC,,Deepest dive to date / no mantas
2018-12-14,Nusa Lembongan,Toya Pakah,Kutlu,19,54,27ºC,,Most beautiful dive site. Incredible colour and coral / Mantis shrimp
2019-01-03,Sri Lanka,Unawatuna,Stef,26,36,28ºC,,
2019-01-03,Sri Lanka,Unawatuna,Stef,16,45,28ºC,,
2019-02-20,Galapagos,Seymour,Stef,15,52,26ºC,,Lots of white tip
2019-02-20,Galapagos,Seymour,Stef,27,46,26ºC,,Hammerheads / Annoying isreali guy
2019-02-21,Galapagos,Gordon Rocks,Stef,27,44,23ºC,,One of the best dives ever even though Stef kicked the reg out my mouth
2019-02-21,Galapagos,Gordon Rocks,Stef,27,46,23ºC,,Hammerheads / Seals / Rays / Turtles / Pufferfish / Lots of currents
2019-03-16,Komodo,Wainilu,Stef,22,48,25ºC,,Tiny shrimp / ribon eels / lion fish
2019-03-16,Komodo,Pulau Sihir,Stef,19,48,25ºC,,Puffer fish / Blue spotted ray / Tiny cuttle fish
2019-03-17,Komodo,Mauan,Stef,16,60,25ºC,,Coral gardens / Aenemone fish
2019-03-17,Komodo,Cauldron,Stef,23,53,25ºC,,Coral gardens / Shotgun passage / Huge ray / Blue spotted ray / Black tip / Turtle / amazing table coral
2019-03-17,Komodo,Golden Passage,,22,51,24ºC,,Huge fan coral / cuttle fish hiding in the fan coral
2019-03-17,Komodo,Gili Iowa,,21,53,24ºC,,Weird squid / Cuttle fish
2019-03-18,Komodo,Makassar Reef (Manta Point),Stef,11,62,26ºC,,Several mantas / manta and turtle at the same time / sun lighting up coral in the shallows
2019-03-18,Komodo,Siaba Besar,Stef,15,60,26ºC,,Some turtles / sandy bottom / no current / clown fish / blue spotted rays
2019-03-18,Komodo,Three Sisters,Stef,24,59,28ºC,,3 pinacles / tons of life / big puffer fish / moray eels / shark on bottom / stone fish
2019-03-18,Komodo,?,,13,49,28ºC,,followed by lion fish / great vis!
2019-03-19,Komodo,The Arch,,28,42,27ºC,,Strong surge / Big swim through / Turtle / Reef hook for safety stop
2019-03-19,Komodo,Secret Garden,Stef,26,60,27ºC,,White tip / Modular Rays / Lion fish / Spotted rays / Puffer fish / School of Humphead Parot Fish
2019-03-19,Komodo,Tatawa Kecil,Stef,20,60,25ºC,,Huge turtle / huge puffer fish
2019-03-19,Komodo,Wainilu,,23,52,24ºC,,Pipefish! / Crocodile fish / lots of shrimp and crab
2019-03-20,Komodo,Penga Kecil,Stef,30,54,26ºC,,Pigme seahorse / big wall / couple of box fish / quite dark due to depth.
2019-04-07,Sydney,Oak Park,"Kasia, Kamil, Sly",9,55,21ºC,,Fin snapped / huge cuttle fish / old wives / cheeky blue grouper
2019-04-07,Sydney,Oak Park,"Kasia, Kamil, Sly",10,60,21ºC,,"Kasia, Kamil, Sly"
2019-05-18,Sydney,Shelly Beach,"Kasia, Kamil",7,90,21ºC,,Dusky whalers / beautiful cuttle fish / big schools of fish / longest dive
2019-05-18,Sydney,Shelly Beach,"Kasia, Kamil",7,75,21ºC,,
2019-05-25,Sydney,Apartments,SDC,16,57,21ºC,,Lots of grey nurse 
2019-05-25,Sydney,Old Man's Hat,SDC,23,38,21ºC,,Weedy seadragon
2019-07-07,Sydney,Apartments,SDC,22,29,18ºC,,One big nurse / One big wobbe. Came up early due to inexperienced diver.
2019-07-07,Sydney,Old Man's Hat,SDC,23,37,17ºC,,Weedy seadragon
2019-07-20,Sydney,North Head,SDC,28,44,16ºC,,Drift dive / Nice coral gardens / nice cuttle fish
2019-07-20,Sydney,South Head,SDC,23,49,16ºC,,Lost of PJs
2019-09-29,Sydney,Shelly Beach,Steve,11,53,16ºC,,Lots of PJs / Found the bike (Just as the rock wall turns?
2019-09-29,Sydney,Shelly Beach,Steve,7,71,16ºC,,
2019-10-25,Great Barrier Reef,Whitsunday Islands,Stef,17,51,24ºC,,Lot's of dead coral :(
2019-10-25,Great Barrier Reef,Whitsunday Islands,Stef,11,60,24ºC,,Large parot fish / Large batfish
2019-11-06,Fiji,Supermarket,Stef,19,62,27ºC,,Lots of reef sharks / beautiful corals
2019-11-06,Fiji,Cast Away,Stef,19,57,27ºC,,Beautiful coral landscapes.
2019-11-07,Fiji,Salamander Wreck,Stef,26,40,27ºC,,Awesome ship wreck! / Went in to the engine room / Stef did the Titanic pose on the front.
2019-11-07,Fiji,Tokoriki Reef,Stef,20,57,27ºC,,Lots of beautiful turtles
2019-11-09,Fiji,Sherwood Forest ,Tokoriki Diving,19,45,27ºC,,Awesome fan corals
2019-11-09,Fiji,Tokoriki Reef,Tokoriki Diving,21,56,27ºC,,Turtle and small shrimp
2019-11-24,Sydney,Steps at Kurnel,"Kasia, Kamil, Adam",13,61,18ºC,,"Weedy seadragon / Kasia, Kamil, Adam"
2019-11-27,Sydney,Manly Nets,Google / DCM,4,33,19ºC,,
2019-12-08,Sydney,Clifton Gardens,Krystal,9,54,19ºC,,Very cute puffer fish
2020-01-04,Sydney,Apartments,Steve,16,24,-,,Nothing :(
2020-01-04,Sydney,Old Man's Hat,Steve,22,22,-,,Weedy seadragons + male with eggs
2020-02-25,Sydney,Clifton Gardens,"Kasia, Kamil, Adam",8,83,20ºC,,Cuttle fish / sea horses / frogfish x3 / Moray eel
2020-03-21,Jervis Bay,The Nursery,"Stef, Steve",15,50,20ºC,,Stef and Steve
2020-03-21,Jervis Bay,The Wall,"Stef, Steve",23,46,20ºC,,Stef and Steve / Huge grey nurse at the end
2020-04-26,Sydney,Gordon's Bay,Sebastian,14,54,20ºC,,
2020-04-26,Sydney,Clifton Gardens,Sebastian,9,43,19ºC,,Lots of sea horses
2020-05-08,Sydney,Clifton Gardens,"Kasia, Sebastian",8,66,18ºC,,Lots of active octopus / lots of small cuttlefish / only two seahorses
2020-06-02,Sydney,Clifton Gardens,"Kamil, Adam",9,76,16ºC,,Found the seahorse hotels. Head along the net until the 'rubble' then follow it at 45º to the left. One hairy frogfish. One octopus with hook. All the usual critters.
2020-06-05,Sydney,Clifton Gardens,Muiris,9,66,16ºC,,Buzzed by huge ray at the end
2020-07-23,Sunshine Coast,HMAS Brisbane,SunReef,23,40,19ºC,,
2020-07-23,Sunshine Coast,HMAS Brisbane,SunReef,23,40,19ºC,,
2020-08-30,Sydney,Apartments,SDC,17,46,16ºC,,
2020-08-30,Sydney,Old Man's Hat,SDC,22,40,16ºC,,
2020-09-06,Sydney,Bare Island,"Kamil, Adam",14,64,16ºC,,
2020-09-06,Sydney,Bare Island,Kamil,14,61,16ºC,,
2020-09-13,Sydney,South Head,SDC,29,52,16ºC,,
2020-09-13,Sydney,Old Man's Hat,SDC,22,44,16ºC,,Amazing viz! Best weedy photos!
2020-09-14,Sydney,Shelly Beach,Sebastian,8,61,16ºC,,Relaxing morning dive before work. Absolute bliss!
2020-10-11,Sunshine Coast,HMAS Brisbane,Scubaworld,27,48,22ºC,,
2020-10-11,Sunshine Coast,HMAS Brisbane,Scubaworld,24,46,21ºC,,Navigated through the wreck on my own (with buddy).
2020-11-21,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",27,52,23ºC,,"Nurse shark at back of ship, huge loggerhead."
2020-11-21,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",23,49,22ºC,,Got decompression sickness
2020-12-23,Sunshine Coast,HMAS Brisbane,Jimmy,23,43,23ºC,,Awful viz! 
2020-12-23,Sunshine Coast,HMAS Brisbane,Jimmy,24,39,23ºC,,
2021-01-17,Sunshine Coast,Wobby Rock,"Kasia, Kamil",19,54,25ºC,,Amazing viz. Lots of beautiful coral. Cute toby fish.
2021-01-17,Sunshine Coast,Wobby Rock,"Kasia, Kamil",19,52,25ºC,,
2021-01-26,Sunshine Coast,Mudjimba Island,SunReef,9,49,26ºC,,
2021-01-26,Sunshine Coast,Mudjimba Island,SunReef,13,47,26ºC,,Terrible viz but still good coral photos
2021-02-13,Sunshine Coast,Flinders Reef,SunReef,15,59,26ºC,,Stunning dives. Slight current and chop on surface. 
2021-02-13,Sunshine Coast,Flinders Reef,SunReef,18,63,24ºC,,Big turtle cleaning on coral. Beautiful relaxing swimthrough..
2021-02-27,Sunshine Coast,HMAS Brisbane,Kasia,24,54,25ºC,,Fun night dive but 2 annoying people in the group and went down too early before it was fully dark!
2021-03-14,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",28,49,24ºC,,Very mixed viz. Anything from 3-10m depending on where we were on the wreck
2021-03-14,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",25,53,24ºC,,Lost Kamil at the end of the dive due to bad viz
2021-03-27,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",20,53,23ºC,,Went inside the wreck. Super cool and a little creepy at night! UV tourches made some of the coral glow.
2021-04-24,Sunshine Coast,Wobby Rock,SunReef,18,49,23ºC,,Cool shot of moray eel
2021-04-24,Sunshine Coast,Wobby Rock,SunReef,19,44,23ºC,,
2021-05-08,Sunshine Coast,Mudjimba Island,Romain,11,48,22ºC,,Worst viz ever. Could barely see anything. Surfaced away from boat.
2021-05-08,Sunshine Coast,Caves,Romain,11,51,22ºC,,Moved here due to bad viz. Viz was better but not a lot to see. Also surfaced far from boat.
2021-06-12,Sunshine Coast,HMAS Brisbane,Kamil,23,52,21ºC,,Great viz. lots of bait fish. Got cool shot looking up the missile silo
2021-06-12,Sunshine Coast,HMAS Brisbane,Kamil,22,53,19ºC,,Huge grouper inside the wreck
2021-07-24,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",27,51,19ºC,,Huge eagle ray on the bottom at the stern
2021-07-24,Sunshine Coast,HMAS Brisbane,"Kasia, Kamil",25,46,19ºC,,
2021-08-14,Sunshine Coast,Wobby Rock,"SunReef, Romain",18,52,19ºC,,3-4 GN sharks. Calm dive but surfaced far from boat
2021-08-14,Sunshine Coast,Wobby Rock,SunReef,19,48,19ºC,,Buddy had problems so joined SR group. Buzzed by large GN shark. 
2021-08-24,Lady Musgrave,Lady Musgrave Outer Reef,LM Experience,20,50,-,,
2021-08-24,Lady Musgrave,Lady Musgrave Outer Reef,LM Experience,20,50,-,,Lots of mantas! Strong currents. Large tawny nurse shark
2021-09-25,Sunshine Coast,Wobby Rock,Romain,20,50,-,,
2021-09-25,Sunshine Coast,Wobby Rock,Romain,20,50,21ºC,,
2021-10-09,Sunshine Coast,La Balsa,"Kasia, Kamil",6,87,22ºC,,
2021-11-04,Lady Elliot,West reefs,LE Diving,22,55,23ºC,,
2021-11-04,Lady Elliot,West reefs,LE Diving,21,60,23ºC,,
2021-11-05,Lady Elliot,Wreck,LE Diving,22,55,23ºC,,
2021-11-06,Lady Elliot,Blowhole,LE Diving,23,59,24ºC,,"Huge tawny nurse shark, Blowhole is amazing! 100% coral coverage"
2021-11-07,Lady Elliot,Blowhole,,25,48,24ºC,,
2021-11-07,Lady Elliot,West reefs,LE Diving,17,59,24ºC,,
2021-11-20,Sunshine Coast,HMAS Brisbane,Jimmy,21,39,21ºC,,
2021-12-04,Sunshine Coast,Wobby Rock,"Karren, Amanda, Kent",19,61,24ºC,,Changed over shark reciever at Wobby Rock
2021-12-05,Sunshine Coast,HMAS Brisbane,Sunreef,22,40,24ºC,,Lots of eagle rays and fish.
2021-12-05,Sunshine Coast,HMAS Brisbane,Sunreef,24,45,24ºC,,2 barracuda circling us at the end.
2021-12-18,Sunshine Coast,Flinders Reef,Sunreef,13,62,24ºC,,3 moral eels - One white one. Couple of turtles
2021-12-18,Sunshine Coast,Flinders Reef,Sunreef,14,60,25ºC,,Beautiful reef and lots of feeding frenzies
2021-12-23,Sunshine Coast,HMAS Brisbane,Sunreef,24,53,24ºC,,
2021-12-23,Sunshine Coast,HMAS Brisbane,Sunreef,24,50,24ºC,,
2022-01-15,Sunshine Coast,Wobby Rock,Kamil,19,51,25ºC,,Successfully navigated us!
2022-01-15,Sunshine Coast,Wobby Rock,Kamil,19,54,25ºC,,A few moray eels and shrimps. Tiny little box fish and Kamil spotted a good nudi!
2022-04-30,Sunshine Coast,The Trench,Sunreef,19,57,23ºC,,Nudibranch dive with Gary Cob. 
2022-04-30,Sunshine Coast,The Trench,Sunreef,18,49,23ºC,,Teeny tiny Nudi! No idea how Gary spotted it.
2022-05-30,Sunshine Coast,HMAS Brisbane,Kamil,24,53,20ºC,,
2022-05-30,Sunshine Coast,HMAS Brisbane,Kamil,24,50,20ºC,,
2022-06-07,Whitsundays,Bait Reef,Explore Group,20,43,25ºC,,"Very dissapointing on the outer reef, lots of dead coral."
2022-06-07,Whitsundays,Butterfly Bay,Explore Group,12,45,24ºC,,"Slightly better around the islands. More healthy coral, but still bery little life."
2022-06-13,Sunshine Coast,HMAS Brisbane,Kamil,24,52,20ºC,,Decent viz but lots of particles. Made for some interesting shots. Excellent start to the week.
2022-06-13,Sunshine Coast,HMAS Brisbane,Kamil,23,53,19ºC,,
2022-07-17,Sunshine Coast,HMAS Brisbane,Sunreef,22,43,17ºC,,Cold. only did one dive. bad viz
2022-08-07,Sunshine Coast,Wobby Rock,Sunreef,19,49,18ºC,,
2022-08-07,Sunshine Coast,Wobby Rock,Sunreef,21,43,18ºC,,
2022-08-15,Sunshine Coast,Wobby Rock,Sunreef,19,47,18ºC,,
2022-08-15,Sunshine Coast,Wobby Rock,Sunreef,19,45,18ºC,,
2022-09-27,Sunshine Coast,HMAS Brisbane,Sunreef,27,50,19ºC,,
2022-09-27,Sunshine Coast,HMAS Brisbane,Sunreef,23,45,19ºC,,
2022-11-14,Sunshine Coast,HMAS Brisbane,Sunreef,23,44,22ºC,,Sunrise Dive
2022-11-26,Sunshine Coast,Hanging Rock,Sunreef,19,56,21ºC,,
2022-11-26,Sunshine Coast,Hanging Rock,Sunreef,20,47,21ºC,,
2023-01-08,Sunshine Coast,HMAS Brisbane,Sunreef,24,49,24ºC,,
2023-01-08,Sunshine Coast,HMAS Brisbane,Sunreef,26,42,24ºC,,
2023-01-29,Sunshine Coast,The Trench,Sunreef,19,54,22ºC,,
2023-01-29,Sunshine Coast,Caves,Sunreef,15,37,23ºC,,
2023-02-18,Lady Musgrave,Lagoon,LM Experience,6,43,27ºC,,
2023-02-18,Lady Musgrave,Lagoon,LM Experience,6,41,27ºC,,
2023-03-19,Sunshine Coast,HMAS Brisbane,Mel,27,51,25ºC,,
2023-03-19,Sunshine Coast,HMAS Brisbane,Mel,25,53,24ºC,,
2023-03-19,Sunshine Coast,HMAS Brisbane,Mark Wynne,23,48,26ºC,,
2023-07-01,Sunshine Coast,Wobby Rock,Amanda,17,47,20ºC,,
2023-07-01,Sunshine Coast,Wobby Rock,Amanda,17,40,18ºC,,
2023-10-02,Sunshine Coast,HMAS Brisbane,Sunreef,27,49,21ºC,,
2023-10-02,Sunshine Coast,HMAS Brisbane,Sunreef,26,46,21ºC,,
2023-11-06,Sunshine Coast,HMAS Brisbane,Sunreef,26,48,21ºC,,
2023-11-06,Sunshine Coast,HMAS Brisbane,Sunreef,22,42,22ºC,,
2023-12-20,Sunshine Coast,Flinders Reef,Sunreef,13,58,24ºC,,
2023-12-20,Sunshine Coast,Flinders Reef,Sunreef,14,53,24ºC,,
2023-12-29,Sunshine Coast,HMAS Brisbane,Sunreef,27,45,22ºC,,
2023-12-29,Sunshine Coast,HMAS Brisbane,Sunreef,24,50,22ºC,,
2024-01-19,Sunshine Coast,HMAS Brisbane,Sunreef,26,49,26ºC,,
2024-01-19,Sunshine Coast,HMAS Brisbane,Sunreef,23,50,26ºC,,
2024-01-22,Sunshine Coast,HMAS Brisbane,Jonny,27,45,25ºC,,Sunrise - Strong surge/current. Terrible viz
2024-03-01,Sunshine Coast,HMAS Brisbane,Michael C,22,53,27ºC,,
2024-03-01,Sunshine Coast,HMAS Brisbane,Michael C,21,55,27ºC,,
2024-03-03,Sunshine Coast,Flinders Reef,Michael C,13,62,27ºC,,
2024-03-03,Sunshine Coast,Flinders Reef,Michael C,9,59,27ºC,,
2024-04-01,Sunshine Coast,HMAS Brisbane,Michael C / Ricky / Sunreef,19,52,25ºC,,"Sunrise - Rolly on surface, beautiful underneath. Macro. Magical eagleray at bow."
2024-04-13,Sunshine Coast,HMAS Brisbane,Kasia,22,56,25ºC,,Forgot to put the battery in my camera! 😫
2024-04-13,Sunshine Coast,HMAS Brisbane,Kasia,23,57,25ºC,,
2024-05-27,Sunshine Coast,HMAS Brisbane,Sunreef,26,53,22ºC,,
2024-05-27,Sunshine Coast,HMAS Brisbane,Sunreef,24,54,22ºC,,
2024-06-08,Sunshine Coast,HMAS Brisbane,Mark Wynne,22,27,22ºC,,SR training
2024-06-08,Sunshine Coast,HMAS Brisbane,Mark Wynne,18,27,22ºC,,SR training
2024-06-08,Sunshine Coast,HMAS Brisbane,Mark Wynne,25,47,22ºC,,SR training - The dive where I missed the dolphins. 😢
2024-07-21,Sunshine Coast,HMAS Brisbane,Solo,26,50,20ºC,,
2024-07-21,Sunshine Coast,HMAS Brisbane,Solo,24,52,20ºC,,Beautiful moment with Barney the turtle. Found each other on the mag deck and swam with each other for about 5 minutes.
2024-07-28,Sunshine Coast,Wobby Rock,Rob Blackmore,18,53,19ºC,,
2024-07-28,Sunshine Coast,Wobby Rock,Rob Blackmore,18,53,19ºC,,Big loggerhaed turtle and huge green turtle! Nice GN encounter at the end - came really close!
2024-08-09,Sunshine Coast,Wobby Rock,Amanda Delaforce,19,56,21ºC,,Swapped out the reciever
2024-08-09,Sunshine Coast,Wobby Rock,Amanda Delaforce,18,29,21ºC,,Very choppy conditions - Actually felt seasick.
2024-08-30,Sunshine Coast,Wobby Rock,Solo,18,59,22ºC,,"[Bio Blitz] Big octopus under rock, very calm and relaxing"
2024-08-30,Sunshine Coast,Wobby Rock,Solo,18,61,22ºC,,[Bio Blitz] JASPER THE SHARK!
2024-08-30,Sunshine Coast,Mudjimba Island,Solo,10,49,21ºC,,[Bio Blitz] Cute cuttlefish. Otherwise quite a boring dive.
2024-09-27,Sunshine Coast,HMAS Brisbane,Solo,27,53,22ºC,,
2024-09-27,Sunshine Coast,HMAS Brisbane,Solo,22,53,22ºC,,Nice eagle ray encounter at the stern
2024-10-12,Sunshine Coast,HMAS Brisbane,Solo,27,53,22ºC,,
2024-10-12,Sunshine Coast,HMAS Brisbane,Solo,26,47,22ºC,,
2024-12-22,Sunshine Coast,Flinders Reef,Michael C,13,67,24ºC,,Beautiful conditions. No current. No turtles or any other big things though.
2024-12-22,Sunshine Coast,Flinders Reef,Michael C,15,59,24ºC,,
2024-12-31,Sunshine Coast,HMAS Brisbane,Solo,28,52,25ºC,,
2024-12-31,Sunshine Coast,HMAS Brisbane,Solo,25,52,25ºC,,
2025-02-09,Maldives,Bodu Thila,"Bunty, Caroline, Fiona, Hannah, Flore",23,54,28ºC,,Check dive. Calm reef
2025-02-09,Maldives,Vilingili Kandu,"Bunty, Caroline, Fiona, Hannah, Flore",34,39,28ºC,,Crazy current. Lots of sharks. Reef hooks needed. Deepest dive!
2025-02-09,Maldives,Turtle Point,"Bunty, Caroline, Fiona, Hannah, Flore",25,63,28ºC,,Fish processing plant. No lights. Dramatic shark shots
2025-02-10,Maldives,Kooddoo Kandu,"Bunty, Caroline, Fiona, Hannah, Flore",31,48,28ºC,,Masked fogged up!
2025-02-10,Maldives,Kooddoo Beyru,"Bunty, Caroline, Fiona, Hannah, Flore",28,54,28ºC,,
2025-02-10,Maldives,Nilandhoo Coral Garden,"Bunty, Caroline, Fiona, Hannah, Flore",26,64,28ºC,,Macro dive. No current. Coral got better as the dive went on
2025-02-11,Maldives,Nilandhoo Kandu,"Bunty, Caroline, Fiona, Hannah, Flore",30,60,28ºC,,Reef hooks. Surprisingly low current. Some sharks and turtles
2025-02-11,Maldives,Vodaamulaa Kandu,"Bunty, Caroline, Fiona, Hannah, Flore",31,46,28ºC,,
2025-02-11,Maldives,Kondey Coral Garden,"Bunty, Caroline, Fiona, Hannah, Flore",27,55,28ºC,,
2025-02-12,Maldives,Gemmanfushi Corner,"Bunty, Caroline, Fiona, Hannah, Flore",31,62,28ºC,,
2025-02-12,Maldives,Maarehaa Eagle Ray Garden,"Bunty, Caroline, Fiona, Hannah, Flore",18,68,28ºC,,
2025-02-12,Maldives,Mafzoo Thila,"Bunty, Caroline, Fiona, Hannah, Flore",25,68,28ºC,,
2025-02-12,Maldives,Mafzoo Thila,"Bunty, Caroline, Fiona, Hannah, Flore",26,55,28ºC,,
2025-02-13,Maldives,Thoondu,"Bunty, Caroline, Fiona, Hannah, Flore",32,49,28ºC,,
2025-02-13,Maldives,Tiger Harbour,"Bunty, Caroline, Fiona, Hannah, Flore",16,50,28ºC,,
2025-02-13,Maldives,South Plateau,"Bunty, Caroline, Fiona, Hannah, Flore",31,30,28ºC,,"Abandoned dive. Strong current, couldn't make it to the reef. Drifted 2-3km in current. Strong up and down currents"
2025-02-14,Maldives,British Loyalty (Wreck),"Bunty, Caroline, Fiona, Hannah, Flore",30,56,28ºC,,
2025-02-14,Maldives,Manta Point,"Bunty, Caroline, Fiona, Hannah, Flore",20,58,28ºC,,No mantas. Hannah's 200th dive!
2025-05-26,Sunshine Coast,Wobby Rock,Rob Blackmore,18,55,22ºC,,Anchor looped around site... lol
2025-05-26,Sunshine Coast,Wobby Rock,Rob Blackmore,18,59,22ºC,,Nice shots of lionfish. 1 large Wobby.
2025-06-08,Sunshine Coast,HMAS Brisbane,,26.0m,55 min,23ºC,,
2025-06-08,Sunshine Coast,HMAS Brisbane,,24.0m,56 min,23ºC,,
2025-06-16,Sunshine Coast,HMAS Brisbane,,25.0m,53 min,21ºC,,
2025-06-16,Sunshine Coast,HMAS Brisbane,,27.0m,52 min,21ºC,,
2025-07-04,Sunshine Coast,HMAS Brisbane,,26.0m,55 min,20ºC,,
2025-07-04,Sunshine Coast,HMAS Brisbane,,27.0m,44 min,20ºC,,
2025-07-20,Sunshine Coast,HMAS Brisbane,,26.0m,54 min,19ºC,,
2025-07-31,Sunshine Coast,HMAS Brisbane,,26.0m,48 min,20ºC,,
2025-07-31,Sunshine Coast,HMAS Brisbane,,26.0m,49 min,20ºC,,
2025-07-31,Sunshine Coast,HMAS Brisbane,,24.0m,54 min,20ºC,,Dolphins at sunset!
2025-07-31,Sunshine Coast,HMAS Brisbane,,23.0m,46 min,20ºC,,Awesome night dive. Properly dark!
2025-07-31,Sunshine Coast,HMAS Brisbane,,22.0m,48 min,20ºC,,
2025-09-30,Sunshine Coast,HMAS Brisbane,,27.0m,55 min,21ºC,,
2025-09-30,Sunshine Coast,HMAS Brisbane,,25.0m,54 min,21ºC,,
2025-11-07,Sunshine Coast,HMAS Brisbane,,28.0m,47 min,21ºC,,
2025-11-07,Sunshine Coast,HMAS Brisbane,,25.0m,50 min,21ºC,,
2025-12-24,Sunshine Coast,HMAS Brisbane,,27.0m,47 min,22ºC,,
2025-12-24,Sunshine Coast,HMAS Brisbane,,27.0m,52 min,22ºC,,`;

// Simple parser for the CSV
// Handles quoted strings with commas inside
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

const parseDives = (csv: string): Dive[] => {
    const lines = csv.trim().split('\n');
    const dives: Dive[] = [];
    
    // Start from 1 to skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = parseCSVLine(line);
        if (cols.length < 2) continue; // Basic validation

        // Mapping based on Header: Date,Location,Site,Buddies,Depth (m),Duration (min),Water temp,Rating,Notes
        const date = cols[0];
        const location = cols[1];
        const site = cols[2];
        const buddies = cols[3];
        const depth = parseFloat(cols[4]) || 0;
        const duration = parseFloat(cols[5]) || 0;
        
        // Clean water temp (remove ºC or -)
        let waterTemp: number | undefined = undefined;
        if (cols[6] && cols[6] !== '-') {
            const temp = parseFloat(cols[6].replace('ºC', '').trim());
            if (!isNaN(temp)) waterTemp = temp;
        }

        const rating = parseInt(cols[7]) || 0;
        const notes = cols[8] ? cols[8].trim() : '';

        dives.push({
            id: `preload-${i}`,
            diveNumber: i,
            date: date,
            location: location,
            site: site,
            buddies: buddies,
            duration: duration,
            maxDepth: depth,
            waterTemp: waterTemp,
            rating: rating,
            notes: notes
        });
    }
    return dives;
};

export const INITIAL_DIVES: Dive[] = parseDives(RAW_CSV);
