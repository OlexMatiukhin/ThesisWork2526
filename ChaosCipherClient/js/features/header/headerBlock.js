export function shouldDisableHeaderElements (block) {
    document.querySelectorAll('header select').forEach(el => {
        el.disabled = block;
    });
}
