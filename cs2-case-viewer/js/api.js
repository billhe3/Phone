export const CSGOApiService = {
    async fetchProjectAssets() {
        // Fetch raw community endpoints concurrently
        const [cratesResponse, skinsResponse] = await Promise.all([
            fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json'),
            fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json')
        ]);

        if (!cratesResponse.ok || !skinsResponse.ok) {
            throw new Error("Unable to connect to upstream asset provider databases.");
        }

        const crates = await cratesResponse.json();
        const skins = await skinsResponse.json();

        // Turn skins array into a dictionary map for instantaneous key lookups
        const skinsDictionary = skins.reduce((map, item) => {
            map[item.id] = item;
            return map;
        }, {});

        return {
            // Isolate only default weapon cases and operational package types
            containers: crates.filter(c => c.type === 'case' || c.type === 'package'),
            skinsRegistry: skinsDictionary
        };
    }
};
