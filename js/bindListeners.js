
// bind subtitle click & click right event
let videoPlaying = false;
let clickTimer = null;
let ankerSubtitleTimer;

function bindListeners() {
    trans.addEventListener('click', onClickTranscript);
    trans.addEventListener('dblclick', onDoubleClickTranscript);
    trans.addEventListener('contextmenu', onClickTranscriptWithRightKey);
    player.addEventListener('play', onPlayerPlay);
    player.addEventListener('pause', onPlayerPause);
}

function onClickTranscript(e) {
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(play, 300);
    function play() {
        e.preventDefault();
        e.stopPropagation();
        const id = e.target.id || e.target.parentNode.id;

        subtitleList.map(item => {
            const node = document.getElementById(item.from);
            if (!node) return;

            // 激活当前点击的节点
            if (item.from == id) {
                node.className = 'active';
                node.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
            } else {
                // 否则删除激活标记
                node.className = '';
            }
        });

        player.currentTime = parseFloat(id);
        player.play();
    }
}

function onDoubleClickTranscript() {
    clearTimeout(clickTimer);
}

function onClickTranscriptWithRightKey(e) {
    e.preventDefault();
    if (videoPlaying) player.pause();
    else player.play();
}

function onPlayerPlay() {
    videoPlaying = true;
    ankerSubtitle();
    ankerSubtitleTimer = setInterval(() => ankerSubtitle(), 1000);
}

function onPlayerPause() {
    videoPlaying = false;
    clearInterval(ankerSubtitleTimer);
}

function ankerSubtitle() {
    const curTime = player.currentTime;
    subtitleList.map(item => {
        const node = document.getElementById(item.from);
        if (!node) return;

        const nodeStartSecs = parseFloat(item.from);
        const nodeEndSecs = parseFloat(item.to);

        // 若处于时间区间内，则该节点激活
        if (nodeStartSecs <= curTime && nodeEndSecs > curTime) {
            node.className = 'active';
            // 移动
            node.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
        } else {
            // 否则删除激活标记
            node.className = '';
        }
    })
}
