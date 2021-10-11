## Scripts

- /scripts/getwassie.js - Download metadata from ARWeave and save it to MongoDB.
- /scripts/analyze.js - Parse downloaded metadata from MongoDB and create new records that include trait counts (and binned trait counts)
- /scripts/\*aggregations.js - Combine the full list of wassies/outcasts/couches with the traits data to calculate a score for each item as well as a ranking value and store in a new mongo collection

## Data

- /data/queries.js - Criteria used to create collections/views for different NFT types
- /data/bins.js - Some trait values that are collected into 'bins' to help with determining rarity

## Bins Descriptions

The problem with assigning rarities based on raw traits is the large number of values available for certain traits - particularly body and belly colours, eyes, feet, and hats. It is difficult for owners to determine which traits are _actually_ rare, vs which traits have a huge number of values. For example, an arrow in a foot has a 1% occurence, as does a 'custard' body colour. However, custard is not any more or less rare than dozens of other colours. Plus, every wassie has a colour assigned, whereas some wassies do not have special 'feet' (such as an arrow). The arrow foot should be given greater weight when figuring an overall rarity than a custard body colour.

To solve this, some widely distributed trait values can be grouped into bins in order to de-emphasize certain values. So if we take several of the body colours with similar distributions (e.g. Custard, Red, Pig Pink) and group them together into a bin labeled "common", the binned colours now become _less rare_ compared to non binned traits such as Clothes and Wieldables.

### Methodology

1. Separate the loomlock NFT collection into three 'types':

- couches: Couches with wassies that have traits unavailable to other items in the collection
- outcasts: Special wassies that all share the same background, body and belly colour, have no sigil, and have special trait values (clothes, eyes, wieldables, etc..) not seen in other wassies
- wassies: Everything else.

Separating into these types ensures we are comparing apples to apples when deriving a rarity ranking. Check [queries.js](data/queries.js) to double check the separation criteria for the NFT types.

2. Count occurrences of all trait values _within_ each type collection.
3. Create bins for certain traits with a large amount of similarly distributed values. Not all traits get bins, and not all values within traits will be put in bins. For example, only the _Eyes_ trait for outcasts have bins, as the other traits within the outcasts group have a relatively small number of values. Also, some Eyes values are not binned and will retain the same rarity/percentage as if the bin. For example - "Sad" and "Bored" are binned in the _common_ group, but "Robot" and "Shy" are not binned, and stand on their own (retaining their original rarity value). Check [bins.js](/data/bins.js) for current groupings.
4. Calculate new occurance/rarity based on bins where applicable. For example, within the outcasts group, an _Eyes_ value of "Displeased" has an occurrence of 3.5% (35/1000). After assigning "Displeased" to the _common_ bin, it now has an occurrnence of 73.5%, as there are 735 occurrences of _common_ eyes among outcasts per 1000 total outcasts. An occurrence of "Robot" eyes (12/1000 = .12%) remains unchanged.
5. Attach new occurrnence/rarity values (when applicable) to all 12345 wassies. In reality, only the outcasts and normal wassies will be affected, as they are the only types with binned attributes.

### Binning Notes

See https://www.wassies.org/Outcastcharts and https://www.wassies.org/Wassiecharts for ordered numerical distributions of traits. I used these charts to assist with binning certain trait values.

#### Outcasts

As there are only 1000 outcasts, there are a much smaller number of total trait values. The only trait that requires binning (in my opinion) is Eyes. These were binned based on numerical distribution where:

- common = 31-62
- rare = 24-26
- Robot, Shy, Hypno, and Anime retain original rarity values

All other outcasts traits were not binned, and retain original rarity values

#### Wassies

- Eyes - similar to outcasts, Eyes were separated by numerical distribution. I arbitrarily chose cutoff points based on eyeballing the chart (no pun intended)
- Sigil - Every regular wassie has a sigil, so simply having one of the six sigils (especially a white/common sigil) should not give more weight than any other trait of similar distribution. I've grouped sigils by status (plain, sage, shaman) to give more weight to the type of sigil rather than the sigil symbol.
- Background - Neutral colors were binned to give further weight to the non-neutral backgrounds.
- Body Colour and Belly Colour - The most egregious offenders of skewing rarity. I judiciously grouped colours based on numerical distribution, and gave a special label to 'solid' color types (where body and bellies match), e.g. Crystal, Glitch, Water, etc... Also, _skeleton_ and _dissected_ values were left alone/unbinned, as owners seem particularly fond of these attributes, so they will be considered more rare than other solid colors.

#### Couches and 1 of 1s

Because these are already so rare, and traits so unique, I don't see a need for binning and left them alone. They will all basically be equally rare (with small amounts of variation in the couches).
