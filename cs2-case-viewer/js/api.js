export const CSGOApiService = {
    async fetchProjectAssets() {
        try {
            // Fetching via unpkg CDN - built for fast, zero-block data distribution
            const [cratesResponse, skinsResponse] = await Promise.all([
                fetch('https://unpkg.com/csgo-api@1.3.0/public/api/en/crates.json'),
                fetch('https://unpkg.com/csgo-api@1.3.0/public/api/en/skins.json')
            ]);

            if (!cratesResponse.ok || !skinsResponse.ok) {
                throw new Error(`CDN Error: ${cratesResponse.status}`);
            }

            const crates = await cratesResponse.json();
            const skins = await skinsResponse.json();

            // Map data to dictionary for instant O(1) loop retrieval
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
