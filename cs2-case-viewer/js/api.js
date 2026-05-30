export const CSGOApiService = {
    async fetchProjectAssets() {
        try {
            // Using the optimized, fast JSDelivr CDN mirrors for absolute reliability
            const [cratesResponse, skinsResponse] = await Promise.all([
                fetch('https://cdn.jsdelivr.net/gh/ByMykel/CSGO-API@main/public/api/en/crates.json'),
                fetch('https://cdn.jsdelivr.net/gh/ByMykel/CSGO-API@main/public/api/en/skins.json')
            ]);

            if (!cratesResponse.ok || !skinsResponse.ok) {
                throw new Error(`DB Server returned status: ${cratesResponse.status} / ${skinsResponse.status}`);
            }

            const crates = await cratesResponse.json();
            const skins = await skinsResponse.json();

            if (!Array.isArray(crates) || !Array.isArray(skins)) {
                throw new Error("Data format received is invalid.");
            }

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
            console.error("API Service Internal Failure:", err);
            throw err;
        }
    }
};
