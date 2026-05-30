// ui.js
// DOM mutation utilities (building cards, toggling modals)
const createCard = (data) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = data;
    return card;
};

const toggleModal = (isVisible) => {
    const modal = document.querySelector('.modal');
    modal.style.display = isVisible ? 'block' : 'none';
};