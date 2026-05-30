export const TIER_COLOR_MAP = {
    "rarity_ancient_weapon": "var(--rarity-covert)",
    "rarity_legendary_weapon": "var(--rarity-classified)",
    "rarity_mythical_weapon": "var(--rarity-restricted)",
    "rarity_rare_weapon": "var(--rarity-milspec)",
    "rarity_uncommon_weapon": "var(--rarity-industrial)",
    "rarity_common_weapon": "var(--rarity-consumer)",
    "rarity_ancient": "var(--rarity-covert)" // Rare Special Items (Knives/Gloves)
};

export function buildCaseCardNode(container, selectionHandler) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
        <img src="${container.image}" alt="${container.name}" loading="lazy">
        <h3>${container.name}</h3>
    `;
    card.addEventListener('click', () => selectionHandler(container));
    return card;
}
