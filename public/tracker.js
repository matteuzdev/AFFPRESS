(function () {
    console.log('AFFPRESS Tracker Initialized');

    const pageId = document.currentScript ? document.currentScript.getAttribute('data-page-id') : null;
    if (!pageId) return;

    // Track View
    fetch('/api/metrics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, eventType: 'view' })
    }).catch(() => { });

    // Track Clicks
    document.addEventListener('click', function (e) {
        const target = e.target.closest('a');
        if (target) {
            fetch('/api/metrics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageId,
                    eventType: 'click',
                    metadata: {
                        href: target.href,
                        text: target.innerText.substring(0, 50)
                    }
                })
            }).catch(() => { });
        }
    });
})();
