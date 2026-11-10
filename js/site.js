(() => {
    const navigation = document.querySelector('.tabs');
    const tabs = Array.from(navigation.querySelectorAll('.tab'));
    const panels = tabs.map(tab => document.querySelector(tab.getAttribute('href')));

    navigation.setAttribute('role', 'tablist');
    tabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panels[index].id);
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].tabIndex = 0;
    });

    function activate(index) {
        tabs.forEach((tab, current) => {
            const selected = current === index;
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            panels[current].hidden = !selected;
        });
    }
    function activateFromHash() {
        if (location.hash === '#research') activate(1);
        else if (['', '#projects', '#github'].includes(location.hash)) activate(0);
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', event => {
            event.preventDefault();
            activate(index);
            history.replaceState(null, '', tab.getAttribute('href'));
        });
        tab.addEventListener('keydown', event => {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            tabs[next].focus();
            tabs[next].click();
        });
    });
    activate(0);
    activateFromHash();
    window.addEventListener('hashchange', activateFromHash);

    document.querySelectorAll('[data-copy]').forEach(button => {
        button.hidden = false;
        button.addEventListener('click', async () => {
            const status = button.closest('.install').querySelector('.copy-status');
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                status.textContent = `${button.dataset.project} URL copied.`;
            } catch {
                status.textContent = 'Please select and copy the package URL above.';
            }
        });
    });
})();
