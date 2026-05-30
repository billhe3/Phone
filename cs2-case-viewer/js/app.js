import { CSGOApiService } from './api.js';
import { buildCaseCardNode, TIER_COLOR_MAP } from './ui.js';

let MASTER_SKINS_LOOKUP = {};

async function runtimeEngineInitialization() {
    const caseGridElement = document.getElementById('case-grid');

    try {
        const { containers, skinsRegistry } = await CSGOApiService.fetchProjectAssets();
        MASTER_SKINS_LOOKUP = skinsRegistry;

        caseGridElement.innerHTML = '';

        containers.forEach(container => {
            if (container && container.image) {
                const cardNode = buildCaseCardNode(container, renderDetailedLootViewModal);
                caseGridElement.appendChild(cardNode);
            }
        });

        attachModalWindowListeners();

    } catch (error) {
        caseGridElement.innerHTML = `
            <div class="loading-state" style="color: var(--rarity-covert);">
                Engine Pipeline Malfunction: ${error.message}
            </div>`;
    }
}

function renderDetailedLootViewModal(container) {
    const lootGridElement = document.getElementById('modal-loot-grid');
    document.getElementById('modal-case-title').innerText = container.name;
    lootGridElement.innerHTML = '';

    if (!container.contains || container.contains.length === 0) {
        lootGridElement.innerHTML = '<div class="loading-state">Special item rewards registry inside.</div>';
    } else {
        container.contains.forEach(itemId => {
            const item = MASTER_SKINS_LOOKUP[itemId];
            if (!item) return;

            const colorHexCode = TIER_COLOR_MAP[item.rarity?.id] || "var(--text-muted)";
            const rarityName = item.rarity?.name || "Standard";
            
            const nameParts = item.name ? item.name.split(' | ') : ["Unknown"];
            const weaponTitle = nameParts[0] || "";
            const skinSubtitle = nameParts[1] ? `| ${nameParts[1]}` : "";

            const lootCard = document.createElement('div');
            lootCard.className = 'loot-item';
            lootCard.style.setProperty('--tier-glow', colorHexCode);
            lootCard.style.borderBottom = `3px solid ${colorHexCode}`;

            lootCard.innerHTML = `
                <img src="${item.image || ''}" alt="${item.name || 'Skin'}" loading="lazy">
                <div class="rarity-label" style="color: ${colorHexCode};">${rarityName}</div>
                <div class="weapon-title">
                    ${weaponTitle}<br><span class="skin-name">${skinSubtitle}</span>
                </div>
            `;
            lootGridElement.appendChild(lootCard);
        });
    }

    const targetModal = document.getElementById('detail-modal');
    targetModal.classList.add('active');
}

function attachModalWindowListeners() {
    const modalElement = document.getElementById('detail-modal');
    document.getElementById('close-modal').addEventListener('click', () => {
        modalElement.classList.remove('active');
    });
    modalElement.addEventListener('click', (event) => {
        if (event.target === modalElement) modalElement.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', runtimeEngineInitialization);
