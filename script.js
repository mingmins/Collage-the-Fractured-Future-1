const puzzleBoard = document.getElementById('puzzle-board');
const imageModeButton = document.getElementById('image-mode-button');
const cameraModeButton = document.getElementById('camera-mode-button');
const camera = document.getElementById('camera');
const takePhotoButton = document.getElementById('take-photo-button');
const photoCanvas = document.getElementById('photo-canvas');

let imageUrl = './푸딩.jpg'; // 기본 이미지
let draggedPiece = null;

// 랜덤 다각형 생성
function generateRandomPolygon() {
    const points = [];
    const numPoints = Math.floor(Math.random() * 2) + 3; // 3~7개의 꼭짓점
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 150; // 0% ~ 100%
        const y = Math.random() * 150; // 0% ~ 100%
        points.push(`${x}% ${y}%`);
    }
    return `polygon(${points.join(", ")})`;
}

// 랜덤 퍼즐 조각 생성
function createPuzzle(numPieces = 10) {
    puzzleBoard.innerHTML = ''; // 기존 퍼즐 초기화
    for (let i = 0; i < numPieces; i++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');

        // 랜덤 모양, 크기 및 위치 설정
        const randomClip = generateRandomPolygon();
        const randomWidth = Math.floor(Math.random() * 150) + 250; // 100px ~ 200px
        const randomHeight = Math.floor(Math.random() * 100) + 100; // 100px ~ 200px
        piece.style.clipPath = randomClip;
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundSize = '400px 400px';
        piece.style.width = `${randomWidth}px`;
        piece.style.height = `${randomHeight}px`;
        piece.style.left = `${Math.random() * (window.innerWidth - randomWidth)}px`;
        piece.style.top = `${Math.random() * (window.innerHeight - randomHeight)}px`;

        piece.addEventListener('mousedown', handleDragStart);
        document.body.appendChild(piece);
    }
}


// 정사각형 퍼즐 조각 생성
function createSquarePiece() {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    const size = Math.floor(Math.random() * 100) + 200; // 200px ~ 300px
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
    piece.style.backgroundImage = `url(${imageUrl})`;
    piece.style.backgroundSize = 'cover';
    piece.style.left = `${Math.random() * (window.innerWidth - size)}px`;
    piece.style.top = `${Math.random() * (window.innerHeight - size)}px`;

    piece.addEventListener('mousedown', handleDragStart);
    document.body.appendChild(piece);
}



// 드래그 이벤트 핸들러
function handleDragStart(event) {
    draggedPiece = event.target;

    const handleMouseMove = (e) => {
        draggedPiece.style.left = `${e.pageX - draggedPiece.offsetWidth / 2}px`;
        draggedPiece.style.top = `${e.pageY - draggedPiece.offsetHeight / 2}px`;
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        draggedPiece = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

// 이미지 모드 활성화
imageModeButton.addEventListener('click', () => {
    imageUrl = './푸딩.jpg'; // 기본 이미지로 설정
    createPuzzle();
});

// 카메라 모드 활성화
cameraModeButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        camera.srcObject = stream;
        camera.style.display = 'block';
        takePhotoButton.style.display = 'block';
    } catch (error) {
        alert('카메라를 사용할 수 없습니다.');
    }
});

// 사진 촬영
takePhotoButton.addEventListener('click', () => {
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = camera.videoWidth;
    photoCanvas.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, photoCanvas.width, photoCanvas.height);
    imageUrl = photoCanvas.toDataURL('image/png');

    // 카메라 종료
    const stream = camera.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    camera.style.display = 'none';
    takePhotoButton.style.display = 'none';

    createPuzzle();
});


const dynamicHeading = document.getElementById('dynamic-heading');

// 마우스 움직임에 따라 폰트 굵기와 자간 변경
document.addEventListener('mousemove', (event) => {
    // 마우스의 X 좌표 가져오기
    const mouseX = event.clientX;
    const windowWidth = window.innerWidth;

    // 마우스 X 좌표에 비례하여 폰트 굵기 계산 (300 ~ 700 범위)
    const fontWeight = Math.min(Math.max(300 + (mouseX / windowWidth) * 400, 300), 700);

    // 자간 계산 (0px ~ 10px 범위)
    const letterSpacing = Math.min(Math.max((mouseX / windowWidth) * 10, 0), 10);

    // 폰트 굵기와 자간 적용
    dynamicHeading.style.fontWeight = fontWeight;
    dynamicHeading.style.letterSpacing = `${letterSpacing}px`;
});


