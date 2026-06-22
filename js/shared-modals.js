// Shared modal helper utilities for pages that toggle modals using the Tailwind CSS "hidden" class.

function showModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('hidden');
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('hidden');
}

function toggleModal(id, force) {
    const modal = document.getElementById(id);
    if (!modal) return;

    if (typeof force === 'boolean') {
        modal.classList.toggle('hidden', !force);
    } else {
        modal.classList.toggle('hidden');
    }
}

function closeModalOnBackdrop(event, modalId) {
    if (!event || !modalId) return;

    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (event.target === modal) {
        modal.classList.add('hidden');
    }
}

function closeModalOnEscape(modalId) {
    if (!modalId) return;

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
        }
    });
}
