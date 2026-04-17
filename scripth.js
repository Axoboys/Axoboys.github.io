const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Retirer active
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
            if(filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});