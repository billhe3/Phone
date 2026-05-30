export const CSGOApiService = {
    async fetchProjectAssets() {
        try {
            const [cratesResponse, skinsResponse] = await Promise.all([
                fetch('https://bymykel.github.io/CSGO-API/api/en/crates.json'),
                fetch('https://bymykel.github.io/CSGO-API/api/en/skins.json')
            ]);

            if (!cratesResponse.ok || !skinsResponse.ok) {
                throw new Error(`DB Server returned status: ${cratesResponse.status}`);
            }

            const crates = await cratesResponse.json();
            const skins = await skinsResponse.json();

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
