// Mapping internal tier ID strings to functional theme property definitions
export const RARITY_THEME_MAP = {
    "rarity_ancient_weapon": "var(--rarity-covert)",
    "rarity_legendary_weapon": "var(--rarity-classified)",
    "rarity_mythical_weapon": "var(--rarity-restricted)",
    "rarity_rare_weapon": "var(--rarity-milspec)",
    "rarity_uncommon_weapon": "var(--rarity-industrial)",
    "rarity_common_weapon": "var(--rarity-consumer)",
    "rarity_ancient": "var(--rarity-covert)"
};

export function createCaseCard(container, onSelectCallback) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
        <img src="${container.image}" alt="${container.name}" style="height: 140px; object-fit: contain; width: 100%;">
        <div style="font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px;">
            ${container.name}
        </div>
    `;
    card.addEventListener('click', () => onSelectCallback(container));
    return card;
}
