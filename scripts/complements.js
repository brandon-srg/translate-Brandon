export function viewHiddenSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle('hidden');
}