
// bind subtitle click & click right event
let clickTimer = null;
let ankerSubtitleTimer = null;
let activeNodeIndex = -1;

function onVideoLoaded() {
    document.addEventListener('keydown', handleVideoShortcut);
}

function onVideoAndTransLoaded() {
    trans.addEventListener('click', onClickTranscript);
    trans.addEventListener('dblclick', onDoubleClickTranscript);
    trans.addEventListener('contextmenu', onClickTranscriptWithRightKey);

    player.addEventListener('play', onPlayerPlay);
    player.addEventListener('pause', onPlayerPause);

    document.addEventListener('keydown', handleTranscriptShortcut);

    if (!player.paused) {
        ankerSubtitle();
        if (ankerSubtitleTimer) clearInterval(ankerSubtitleTimer);
        ankerSubtitleTimer = setInterval(() => ankerSubtitle(), 1000);
    }
}

function onClickTranscript(e) {
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(play, 300);
    function play() {
        e.preventDefault();
        e.stopPropagation();
        const id = e.target.id || e.target.parentNode.id;

        subtitleList.map((item, index) => {
            const node = document.getElementById(item.from);
            if (!node) return;

            // 激活当前点击的节点
            if (item.from == id) {
                node.className = 'active';
                node.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
                activeNodeIndex = index;
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
    if (!player.paused) player.pause();
    else player.play();
}

function onPlayerPlay() {
    ankerSubtitle();
    if (ankerSubtitleTimer) clearInterval(ankerSubtitleTimer);
    ankerSubtitleTimer = setInterval(() => ankerSubtitle(), 1000);
}

function onPlayerPause() {
    clearInterval(ankerSubtitleTimer);
}

function ankerSubtitle() {
    const curTime = player.currentTime;
    subtitleList.map((item, index) => {
        const node = document.getElementById(item.from);
        if (!node) return;

        const nodeStartSecs = item.from;
        const nodeEndSecs = item.to;

        // 若处于时间区间内，则该节点激活
        if (nodeStartSecs <= curTime && nodeEndSecs > curTime) {
            node.className = 'active';
            // 移动
            node.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
            activeNodeIndex = index;
        } else {
            // 否则删除激活标记
            node.className = '';
        }
    });
}

function handleVideoShortcut(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];

    // 按 d D
    if (e && e.keyCode == 68) {
        if (!player.paused) player.pause();
        else player.play();
    }

     // 按 s S
    if (e && e.keyCode == 83) player.currentTime -= 2;

    // 按 f F
    if (e && e.keyCode == 70) player.currentTime += 2;
}

function handleTranscriptShortcut(e) {
    var e = event || window.event || arguments.callee.caller.arguments[0];

    // 按 e E
    if (e && e.keyCode == 69 && activeNodeIndex > 0) {
        player.currentTime = subtitleList[activeNodeIndex].from;
    }

    // 按 w W
    if (e && e.keyCode == 87) {
        if (activeNodeIndex > 0) {
            player.currentTime = subtitleList[activeNodeIndex-1].from;
            activeNodeIndex--;
        }
        else if (activeNodeIndex == 0) {
            player.currentTime = subtitleList[activeNodeIndex].from;
        }
    }

    // 按 r R
    if (e && e.keyCode == 82) {
        if (activeNodeIndex < subtitleList.length) {
            player.currentTime = subtitleList[activeNodeIndex + 1].from;
            activeNodeIndex++;
        }
        else if (activeNodeIndex == subtitleList.length) {
            player.currentTime = subtitleList[activeNodeIndex].from;
        }
    }

    if ( e && e.keyCode == 69 || e.keyCode == 87 || e.keyCode == 82) {
        player.play();
    }
}
