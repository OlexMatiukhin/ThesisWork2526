export function blockUnblockHeaderElements(block) {
    document.querySelectorAll('header select').forEach(el => {
        el.disabled = block;
    });
}