// NOTE: Explicitly including '.js' extensions ensures absolute paths resolve on Render CDNs without 404s
import { CSGOApiService } from './api.js';
import { buildCaseCardNode, TIER_COLOR_MAP } from './ui.js';

let MASTER_SKINS_LOOKUP = {};

async function runtimeEngineInitialization() {
    const caseGridElement = document.getElementById('case-grid');

    try {
        const { containers, skinsRegistry } = await CSGOApiService.fetchProjectAssets();
        MASTER_SKINS_LOOKUP = skinsRegistry;

        // Clear loading message anchor
        caseGridElement.innerHTML = '';

        // Populates main grid catalog UI
        containers.forEach(container => {
            const cardNode = buildCaseCardNode(container, renderDetailedLootViewModal);
            caseGridElement.appendChild(cardNode);
        });

        attachModalWindowListeners();

    } catch (error) {
        console.error("Initialization crash:", error);
        caseGridElement.innerHTML = `
            <div class="loading-state" style="color: var(--rarity-covert);">
                Engine Pipeline Malfunction: ${error.message}
            </div>`;
    }
}

function renderDetailedLootViewModal(container) {
    const lootGridElement = document.getElementById('modal-loot-grid');
    document.getElementById('modal-case-title').innerText = container.name;
    
    // Wipe layout view clean
    lootGridElement.innerHTML = '';

    // Loop directly over inner payload targets mapped to lookup indexes
    container.contains.forEach(itemId => {
        const item = MASTER_SKINS_LOOKUP[itemId];
        if (!item) return;

        const colorHexCode = TIER_COLOR_MAP[item.rarity?.id] || "var(--text-muted)";
        
        // Split item text name (e.g., "AK-47 | Redline") cleanly into Title and Skin components
        const nameParts = item.name.split(' | ');
        const weaponTitle = nameParts[0] || "";
        const skinSubtitle = nameParts[1] ? `| ${nameParts[1]}` : "";

        const lootCard = document.createElement('div');
        lootCard.className = 'loot-item';
        
        // Pass tier configuration colors directly via custom properties to build dynamic neon backgrounds
        lootCard.style.setProperty('--tier-glow', colorHexCode);
        lootCard.style.borderBottom = `3px solid ${colorHexCode}`;

        lootCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="rarity-label" style="color: ${colorHexCode};">${item.rarity.name}</div>
            <div class="weapon-title">
                ${weaponTitle}<br><span class="skin-name">${skinSubtitle}</span>
            </div>
        `;
        
        lootGridElement.appendChild(lootCard);
    });

    const targetModal = document.getElementById('detail-modal');
    targetModal.classList.add('active');
    targetModal.setAttribute('aria-hidden', 'false');
}

function attachModalWindowListeners() {
    const modalElement = document.getElementById('detail-modal');
    
    document.getElementById('close-modal').addEventListener('click', () => {
        modalElement.classList.remove('active');
        modalElement.setAttribute('aria-hidden', 'true');
    });

    // Dismiss overlay windows if user clicks outside content panel bounds
    modalElement.addEventListener('click', (event) => {
        if (event.target === modalElement) {
            modalElement.classList.remove('active');
            modalElement.setAttribute('aria-hidden', 'true');
        }
    });
}

// Instantiate core lifecycle event hook
document.addEventListener('DOMContentLoaded', runtimeEngineInitialization);
