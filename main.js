const player = document.getElementById('video');
const trans = document.getElementsByClassName("transcripts")[0];
let subtitleList = [];

function handleFiles(selectedFiles) {
    const file = selectedFiles[0];
    var fileName = file.name;
    let fileType = fileName.split('.').pop(); // 获取文件类型

    switch (fileType) {
        // 读取并解析字幕文件
        case 'ass': case 'srt': {
            var reader = new FileReader(); // 创建一个 FR 对象
            reader.readAsText(file); //读取文件的内容
            reader.onload = function () {
                //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
                const sbtStr = this.result;
                subtitleList = parse(sbtStr, fileType); // 解析文件内容，获得字幕 list
                appendSubtitleNodes(subtitleList); // 挂载字幕节点
            }
        }; break;

        // 视频文件
        case 'mp4': {
            // 获取文件路径
            // const filePath = getvl(selectedFiles);
            // console.log(filePath);
        } break;

        default: alert('不支持的文件类型！');
    }
}


// append subtitle nodes
const appendSubtitleNodes = (subtitles) => {
    let subtitleHtmlStr = '';
    subtitles.map(item => {
        if (item.text1.length == 0 && item.text2.length == 0) subtitleHtmlStr += '';
        else subtitleHtmlStr += (
                    '<div id=' + item.from + '>' + 
                            '<span class="major-subtitle">' + item.text2 + '</span>' + 
                            '<span class="minor-subtitle">' + item.text1 + '</span>' + 
                            '<div class="hr"></div>' + 
                    '</div>'
            );
    });
    trans.innerHTML = subtitleHtmlStr;
}


// bind subtitle click & click right event
let videoPlaying = false;
let clickTimer = null;
trans.addEventListener('click', (e) => {
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
});
trans.addEventListener('dblclick', () => {
    clearTimeout(clickTimer);
});
trans.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (videoPlaying) player.pause();
    else player.play();
});


let ankerSubtitleTimer;
player.onplay = () => {
    videoPlaying = true;
    ankerSubtitle(player, subtitleList);
    ankerSubtitleTimer = setInterval(() => ankerSubtitle(player, subtitleList), 1000);
};

player.onpause = () => {
    videoPlaying = false;
    clearInterval(ankerSubtitleTimer);
}

const ankerSubtitle = (player, subtitleList) => {
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
