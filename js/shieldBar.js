let shield;
let shieldContainer;
let container = document.getElementsByClassName('container')[0];
let addShieldBtn = document.getElementById('addShield');
let flag = false;

function handleAddShield() {
    if (!flag) {
        flag = true;
        addShield();
        addShieldBtn.textContent = '去除字幕遮挡';
    } else {
        flag = false;
        deleteShield();
        addShieldBtn.textContent = '添加字幕遮挡';
    }
}

function addShield() {
    shield = document.createElement("div");
    shield.className = 'shield';

    shieldContainer = document.createElement("div");
    shieldContainer.className = 'shield-container';
    shieldContainer.appendChild(shield);
    shieldContainer.draggable = true;
    shieldContainer.style.top = '0px';
    shieldContainer.style.left = '0px';
    shieldContainer.addEventListener('dragstart', handleStartDragShield);

    container.appendChild(shieldContainer);
}

function deleteShield() {
    shieldContainer.removeEventListener('dragstart', handleStartDragShield);
    shieldContainer.removeChild(shield);
    container.removeChild(shieldContainer);
    shieldContainer = null;
    shield = null;
}

const mouse = {};
const bar = {};
function handleStartDragShield(e) {
    // e.preventDefault();

    //记录鼠标点击的坐标
    mouse.startX = e.pageX;
    mouse.startY = e.pageY;

    // 记录遮挡条的坐标
    bar.left = parseInt(shieldContainer.style.left.slice(0, -2));
    bar.top = parseInt(shieldContainer.style.top.slice(0, -2)); 

    shieldContainer.addEventListener('dragover', handleDragShield);
    shieldContainer.addEventListener('dragend', handleDropShield);
}

function handleDragShield(e) {
    mouse.currentX = e.pageX; //获取鼠标移动后的坐标
    mouse.currentY = e.pageY;
    
	var disX = mouse.currentX - mouse.startX; //获取物体应该移动的距离
    var disY = mouse.currentY - mouse.startY;
    
    shieldContainer.style.left = bar.left + disX + 'px';
    shieldContainer.style.top = bar.top + disY + 'px';
}

function handleDropShield() {
    document.removeEventListener('dragover', handleDragShield); //移除文档对象的鼠标移动和鼠标弹起监听事件
	document.removeEventListener('dragend', handleDropShield);
}