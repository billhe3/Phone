export const CSGOApiService = {
    async fetchProjectAssets() {
        try {
            // Using the official CORS-enabled API proxy addresses
            const [cratesResponse, skinsResponse] = await Promise.all([
                fetch('https://bymykel.github.io/CSGO-API/api/en/crates.json'),
                fetch('https://bymykel.github.io/CSGO-API/api/en/skins.json')
            ]);

            if (!cratesResponse.ok || !skinsResponse.ok) {
                throw new Error(`Data Mirror Error: ${cratesResponse.status}`);
            }

            const crates = await cratesResponse.json();
            const skins = await skinsResponse.json();

            // Safe lookup registry conversion
            const skinsDictionary = skins.reduce((map, item) => {
                if (item && item.id) {
                    map[item.id] = item;
                }
                return map;
            }, {});

            return {
                // Filter down to weapon cases and souvenir packages
                containers: crates.filter(c => c && (c.type === 'case' || c.type === 'package')),
                skinsRegistry: skinsDictionary
            };
        } catch (err) {
            console.error("API Error caught:", err);
            throw new Error("CORS Security Block or Request Timeout");
        }
    }
};
