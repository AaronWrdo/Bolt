import { player, trans } from './js/global.js';
import { parse } from './js/parseSubtitle.js';
import { onVideoLoaded, onVideoAndTransLoaded } from './js/bindListeners.js';


let subtitleList = [];

init();

function init() {
    const fileInput = document.getElementById('file');
    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));

    const fileChosers = document.getElementsByClassName('file-choser');
    [...fileChosers].map(fc => {
        fc.addEventListener('drop', handleDropFile);
    });
}

function handleDropFile(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; //获取拖拽的文件列表
    handleFile(file);
}

function handleFile(file) {
    if (!file) return;
    const fileName = file.name;
    const fileType = fileName.split('.').pop(); // 获取文件类型

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
                if (player.src) onVideoAndTransLoaded(subtitleList);
            }
        }; break;

        // 视频文件
        case 'mp4': {
            let url = URL.createObjectURL(file);
            appendVideo(url);
            onVideoLoaded();
            const title = document.getElementById('title');
            title.textContent = fileName;
            if (subtitleList.length > 0) onVideoAndTransLoaded(subtitleList);
        }; break;

        default: window.alert('不支持的文件类型！');
    }
}

// append video 
function appendVideo(url) {
    player.className = '';
    player.parentNode.childNodes[1].className = 'hidden';
    player.removeAttribute("src");
    player.src = url;
    player.onload = function () {
        window.URL.revokeObjectURL(url); 
    };
}

// append subtitle nodes
const appendSubtitleNodes = (subtitles) => {
    let subtitleHtmlStr = '';
    subtitles.map((item, index) => {
        const len = subtitleList.length;
        if (item.text1.length == 0 && item.text2.length == 0) subtitleHtmlStr += '';
        else subtitleHtmlStr += (
            `<div>
                <div class="subtitle-left">
                    <svg id="sub-play-btn" class="icon" aria-hidden="true">
                        <use xlink:href="#icon-dianying"></use>
                    </svg>
                    <svg id="sub-mark-btn" class="icon" aria-hidden="true">
                        <use xlink:href="#icon-dianying"></use>
                    </svg>
                </div>

                <div id='${item.from}' data-index="${index}">
                    <div class="major-subtitle">
                        ${item.text2}
                    </div>
                    <div class="minor-subtitle">
                        ${item.text1}(${(index+1)}/${len})
                    </div>
                </div>
            </div>`
        );
    });
    trans.className += ' scroll';
    trans.innerHTML = subtitleHtmlStr;
}
