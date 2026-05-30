import { CSGOApiService } from './api.js';
import { createCaseCard, RARITY_THEME_MAP } from './ui.js';

let GLOBAL_SKINS_REGISTRY = {};

async function startApplication() {
    const caseGridContainer = document.getElementById('case-grid');
    
    try {
        const { containers, skinsMap } = await CSGOApiService.fetchAllData();
        GLOBAL_SKINS_REGISTRY = skinsMap;

        containers.forEach(box => {
            const node = createCaseCard(box, openDetailedLootModal);
            caseGridContainer.appendChild(node);
        });
    } catch (err) {
        caseGridContainer.innerHTML = `<p style="color: var(--rarity-covert);">Error compiling assets: ${err.message}</p>`;
    }
}

function openDetailedLootModal(box) {
    const lootGrid = document.getElementById('modal-loot-grid');
    lootGrid.innerHTML = ''; 
    document.getElementById('modal-case-title').innerText = box.name;

    // Map content items, looking up properties seamlessly
    box.contains.forEach(id => {
        const item = GLOBAL_SKINS_REGISTRY[id];
        if (!item) return;

        const colorVar = RARITY_THEME_MAP[item.rarity?.id] || "var(--text-muted)";
        const node = document.createElement('div');
        node.className = 'loot-item';
        node.style.setProperty('--rarity-color', colorVar);
        node.style.borderBottom = `3px solid ${colorVar}`;

        node.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 90px; object-fit: contain;">
            <div style="font-size: 11px; font-weight: bold; width: 100%; text-align: left; margin-top: 8px;">
                ${item.name.replace(' | ', '<br><span style="opacity: 0.6; font-weight: normal;">') + '</span>'}
            </div>
        `;
        lootGrid.appendChild(node);
    });

    document.getElementById('detail-modal').classList.add('active');
}

// Global invocation event loop bound hook
document.addEventListener('DOMContentLoaded', startApplication);
