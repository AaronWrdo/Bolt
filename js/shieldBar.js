let shield;
let shieldContainer;
let _addShieldBtn = document.getElementById('addShield');
let flag = false;

export function handleAddShield() {
    if (!flag) {
        flag = true;
        _addShield();
        _addShieldBtn.textContent = '去除字幕遮挡';
    } else {
        flag = false;
        _deleteShield();
        _addShieldBtn.textContent = '添加字幕遮挡';
    }
}

function _addShield() {
    shield = document.createElement("div");
    shield.className = 'shield';

    shieldContainer = document.createElement("div");
    shieldContainer.className = 'shield-container';
    shieldContainer.appendChild(shield);
    shieldContainer.style.top = '420px';
    shieldContainer.style.left = '100px';
    shieldContainer.draggable = true;
    shieldContainer.addEventListener('dragstart', _handleStartDragShield);

    document.body.appendChild(shieldContainer);
}

function _deleteShield() {
    shieldContainer.removeChild(shield);
    shieldContainer.removeEventListener('dragstart', _handleStartDragShield);
    shield = null;

    document.body.removeChild(shieldContainer);
    shieldContainer = null;
}

const mouse = {};
const bar = {};
function _handleStartDragShield(e) {
    //记录鼠标点击的坐标
    mouse.startX = e.pageX;
    mouse.startY = e.pageY;

    // 记录遮挡条的坐标
    bar.left = parseInt(shieldContainer.style.left.slice(0, -2));
    bar.top = parseInt(shieldContainer.style.top.slice(0, -2));

    // body 开始监听 ShieldBar的拖放
    document.body.addEventListener('dragover', _handleDragover);
    document.body.addEventListener('drop', _handleDrop);
}

function _handleDragover(e) {
    e.preventDefault();
};

function _handleDrop(e) {
    e.preventDefault();

    mouse.currentX = e.pageX; //获取鼠标移动后的坐标
    mouse.currentY = e.pageY;
    
	let disX = mouse.currentX - mouse.startX; //获取物体应该移动的距离
    let disY = mouse.currentY - mouse.startY;
    
    shieldContainer.style.left = bar.left + disX + 'px';
    shieldContainer.style.top = bar.top + disY + 'px';

    // body 移除监听 ShieldBar的拖放
    document.body.removeEventListener('dragover', _handleDragover);
    document.body.removeEventListener('drop', _handleDrop);
} 