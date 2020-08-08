import { player, trans } from './global.js';
import { handleAddShield } from './shieldBar.js';

// bind subtitle click & click right event
let clickTimer = null;
let ankerSubtitleTimer = null;
let activeNodeIndex = -1;
const subListener = document.getElementById('choose-sub');
const addShieldBtn = document.getElementById('addShield');

let subtitleList = [];

// 循环
let loopFrom, loopTo; // 循环起终点
const loop_from = document.getElementById('loop_from');
const loop_to = document.getElementById('loop_to');


export function onVideoLoaded() {
    addShieldBtn.addEventListener('click', handleAddShield)
    document.addEventListener('keydown', _handleVideoShortcut);
}

export function onVideoAndTransLoaded(subtitles) {
    subtitleList = subtitles;

    // trans.addEventListener('click', _onClickTranscript);
    // trans.addEventListener('dblclick', _onDoubleClickTranscript);
    trans.addEventListener('contextmenu', _onClickTranscriptWithRightKey);

    player.addEventListener('play', _onPlayerPlay);
    player.addEventListener('pause', _onPlayerPause);

    // 需要subtitle list，暂时放这里
    document.addEventListener('keydown', _handleTranscriptShortcut);

    subListener.addEventListener('click', _chooseSubtitle);

    if (ankerSubtitleTimer) clearInterval(ankerSubtitleTimer);
    ankerSubtitleTimer = setInterval(() => {
        _ankerSubtitle(); // 定位字幕
    }, 1000);
}

// 点击播放该句子（暂时去掉）
function _onClickTranscript(e) {
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

function _onDoubleClickTranscript() {
    clearTimeout(clickTimer);
}

function _onClickTranscriptWithRightKey(e) {
    e.preventDefault();
    if (!player.paused) player.pause();
    else player.play();
}

function _onPlayerPlay() {
    _ankerSubtitle();
    if (ankerSubtitleTimer) clearInterval(ankerSubtitleTimer);
    ankerSubtitleTimer = setInterval(() => _ankerSubtitle(), 1000);
}

function _onPlayerPause() {
    clearInterval(ankerSubtitleTimer);
}

function _ankerSubtitle() {
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

function _handleVideoShortcut(event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) return;

    switch(e.keyCode) {
        // 按 E 暂停
        case 69: {
            if (!player.paused) player.pause();
            else player.play();
        }; break;

        // 按 W 回退2秒
        case 87: {
            player.currentTime -= 2;
        }; break;

        // 按 R 前进2秒
        case 82: {
            player.currentTime += 2;
        }; break;

        // '1' 设置循环起点
        case 49: {
            loopFrom = player.currentTime;
            _bindAnkerLooper();
        }; break;

        // '2' 设置循环终点
        case 50: {
            loopTo = player.currentTime;
            _bindAnkerLooper();
        }; break;

        // '3' 取消循环
        case 51: {
            loopFrom = undefined;
            loopTo = undefined;
            _bindAnkerLooper();
        }; break;

        // 无论如何都播放
        case 87: case 82: {
            player.play();
        }
    }
}

function _handleTranscriptShortcut(e) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) return;

    switch(e.keyCode) {
        // 按 D 暂停
           case 68: {
            if (!player.paused) player.pause();
            else player.play();
            
            // (暂时弃用) 播放该句
            // if (activeNodeIndex > 0) player.currentTime = subtitleList[activeNodeIndex].from;
        }; break;

        // 按 S 播放上一句
        case 83: {
            if (activeNodeIndex > 0) {
                player.currentTime = subtitleList[activeNodeIndex-1].from;
                activeNodeIndex--;
            }
            else if (activeNodeIndex == 0) {
                player.currentTime = subtitleList[activeNodeIndex].from;
            }
            player.play();
        }; break;

        // 按 F 播放下一句
        case 70: {
            if (activeNodeIndex < subtitleList.length) {
                player.currentTime = subtitleList[activeNodeIndex + 1].from;
                activeNodeIndex++;
            }
            else if (activeNodeIndex == subtitleList.length) {
                player.currentTime = subtitleList[activeNodeIndex].from;
            }
            player.play();
        }; break;
    }
}

function _secsToMinSec(seconds) {
    const min = parseInt(seconds / 60);
    const sec = parseInt(seconds % 60);
    return `${min} : ${sec}`;
}

function _chooseSubtitle(e) {
    console.log(e);
}

// 设置 "起止区间" 后调用
let ankerLoopTimer = null;
function _bindAnkerLooper() {
    if (loopFrom > loopTo) {
        loopFrom = undefined;
        loopTo = undefined;
    }

    // 为 from 和 to 设置默认值
    loopFrom = loopFrom || 0;
    loopTo = loopTo || player.duration;

    // 设置显示的区间
    loop_from.textContent = _secsToMinSec(loopFrom);
    loop_to.textContent = _secsToMinSec(loopTo);

    if (ankerLoopTimer) clearInterval(ankerLoopTimer);
    ankerLoopTimer = setInterval(() => {
        if (!player.play) return;
        if (player.currentTime > loopTo) player.currentTime = loopFrom;
        if (player.currentTime < loopFrom) player.currentTime = loopFrom;
    }, 1000);
}
