/**
 * Service handler responsible for external endpoint resource fetching
 */
export const CSGOApiService = {
    async fetchAllData() {
        const [cratesRes, skinsRes] = await Promise.all([
            fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/crates.json'),
            fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json')
        ]);

        if (!cratesRes.ok || !skinsRes.ok) throw new Error("Data retrieval pipeline failure.");

        const crates = await cratesRes.json();
        const skins = await skinsRes.json();

        // Structural parsing reduction -> Array map translation to O(1) dynamic dictionary map 
        const skinsDictionary = skins.reduce((acc, currentItem) => {
            acc[currentItem.id] = currentItem;
            return acc;
        }, {});

        return {
            containers: crates.filter(item => item.type === 'case' || item.type === 'package'),
            skinsMap: skinsDictionary
        };
    }
};
