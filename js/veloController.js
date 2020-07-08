// controller
let veloChangeTimer = null;
const velocity = document.getElementById('velocity');

velocity.addEventListener('input', e => {
    if (veloChangeTimer) clearTimeout(veloChangeTimer);
    veloChangeTimer = setTimeout(() => {
        let value = parseFloat(e.srcElement.value) || 1.0;
        if (value > 2) value = 2.0;
        if (value <= 0) value = 1.0;
        player.playbackRate = value;
        velocity.value = value;
    }, 600);
});
