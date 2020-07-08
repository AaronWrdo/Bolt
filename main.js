const player = document.getElementById("video");
const trans = document.getElementsByClassName("transcripts")[0];
let playerLoad = false;
let subtitleList = [];

function handleFiles(selectedFiles) {
    const file = selectedFiles[0];
    var fileName = file.name;
    let fileType = fileName.split('.').pop(); // 获取文件类型

    switch (fileType) {
        // 读取并解析字幕文件
        // todo: 支持 .srt 格式
        case 'ass': {
            var reader = new FileReader(); // 创建一个 FR 对象
            reader.readAsText(file); //读取文件的内容
            reader.onload = function () {
                //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
                const sbtStr = this.result;
                subtitleList = parse(sbtStr, fileType); // 解析文件内容，获得字幕 list
                appendSubtitleNodes(subtitleList); // 挂载字幕节点
                if (player.src) bindListeners();
            }
        }; break;

        // 视频文件
        case 'mp4': case 'mkv': {
            let url = URL.createObjectURL(file);
            appenVideo(url);
            playerLoad = true;
            if (subtitleList.length > 0) bindListeners();
        }; break;

        default: alert('不支持的文件类型！');
    }
}

// append video 
function appenVideo(url) {
    player.removeAttribute("src");
    player.src = url;
    player.onload = function () {
        window.URL.revokeObjectURL(url); 
    };
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
