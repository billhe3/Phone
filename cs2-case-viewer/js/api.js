export const CSGOApiService = {
    async fetchProjectAssets() {
        try {
            // Target production endpoints
            const targetCratesUrl = 'https://bymykel.github.io/CSGO-API/api/en/crates.json';
            const targetSkinsUrl = 'https://bymykel.github.io/CSGO-API/api/en/skins.json';

            // Wrap endpoints using the AllOrigins proxy wrapper to instantly smash CORS blocking filters
            const [cratesResponse, skinsResponse] = await Promise.all([
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetCratesUrl)}`),
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetSkinsUrl)}`)
            ]);

            if (!cratesResponse.ok || !skinsResponse.ok) {
                throw new Error(`Proxy transport failed: ${cratesResponse.status}`);
            }

            const cratesProxyData = await cratesResponse.json();
            const skinsProxyData = await skinsResponse.json();

            // AllOrigins wraps the raw JSON contents as a string under the ".contents" property
            const crates = JSON.parse(cratesProxyData.contents);
            const skins = JSON.parse(skinsProxyData.contents);

            if (!Array.isArray(crates) || !Array.isArray(skins)) {
                throw new Error("Parsed data format mismatch.");
            }

            // Map down the dictionary table
            const skinsDictionary = skins.reduce((map, item) => {
                if (item && item.id) {
                    map[item.id] = item;
                }
                return map;
            }, {});

            return {
                containers: crates.filter(c => c && (c.type === 'case' || c.type === 'package')),
                skinsRegistry: skinsDictionary
            };
        } catch (err) {
            console.error("API Fetch Error:", err);
            throw err;
        }
    }
};
