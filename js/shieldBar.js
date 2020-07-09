let shield;
let shieldContainer;
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
    shieldContainer.style.top = '420px';
    shieldContainer.style.left = '100px';
    shieldContainer.draggable = true;
    shieldContainer.addEventListener('dragstart', handleStartDragShield);

    document.body.appendChild(shieldContainer);
}

function deleteShield() {
    shieldContainer.removeChild(shield);
    shieldContainer.removeEventListener('dragstart', handleStartDragShield);
    shield = null;

    document.body.removeChild(shieldContainer);
    shieldContainer = null;
}

const mouse = {};
const bar = {};
function handleStartDragShield(e) {
    //记录鼠标点击的坐标
    mouse.startX = e.pageX;
    mouse.startY = e.pageY;

    // 记录遮挡条的坐标
    bar.left = parseInt(shieldContainer.style.left.slice(0, -2));
    bar.top = parseInt(shieldContainer.style.top.slice(0, -2));

    // body 开始监听 ShieldBar的拖放
    document.body.addEventListener('dragover', handleDragover);
    document.body.addEventListener('drop', handlDrop);
}

function handleDragover(e) {
    e.preventDefault();
};

function handlDrop(e) {
    e.preventDefault();

    mouse.currentX = e.pageX; //获取鼠标移动后的坐标
    mouse.currentY = e.pageY;
    
	let disX = mouse.currentX - mouse.startX; //获取物体应该移动的距离
    let disY = mouse.currentY - mouse.startY;
    
    shieldContainer.style.left = bar.left + disX + 'px';
    shieldContainer.style.top = bar.top + disY + 'px';

    // body 移除监听 ShieldBar的拖放
    document.body.removeEventListener('dragover', handleDragover);
    document.body.removeEventListener('drop', handlDrop);
} 