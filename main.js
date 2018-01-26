const fileIpt = document.querySelector('input');
const button = document.querySelector('button');
const select = document.querySelector('select');
const download = document.querySelector('a');
const reader = new FileReader();
const images = [];
let widthUsed = 0, heightUsed = 0;
const heights = [];

// 多图
let multipleImages = [];
let totalLength;

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 500;
}

initCanvas();

function cropCanvas() {
  console.log(widthUsed, heightUsed)
  if (widthUsed < window.innerWidth) {
    canvas.width = widthUsed;
    canvas.height = heightUsed;
  }
}

fileIpt.addEventListener('change', handleFiles, false);

function handleFiles() {
  totalLength = this.files.length;
  if (totalLength === 1) {
    reader.onload = processImg;
    reader.readAsDataURL(this.files[0]);
  } else if (totalLength > 1) {
    Array.from(this.files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => processImg2(reader, index);
      reader.readAsDataURL(file);
    });
  }
}

// 多图
function processImg2(reader, index) {
  const img = new Image();
  img.src = reader.result;
  const level = select.value - 1;
  if (!images[level]) {
    images[level] = [];
  }
  img.onload = () => {
    multipleImages[index] = img;
    if (multipleImages.filter(v => v).length === totalLength) {
      images[level].push(...multipleImages);
      multipleImages = [];
      draw();
    }
  };
}

// 单图
function processImg() {
  const img = new Image();
  img.src = reader.result;
  const level = select.value - 1;
  if (!images[level]) {
    images[level] = [];
  }
  images[level].push(img);
  img.onload = () => draw();
}

function draw(done) {
  fileIpt.value = '';
  !done && initCanvas();
  context.clearRect(0, 0, canvas.width, canvas.height);
  images.forEach((row, rowIdx) => {
    if (row) {
      let offsetLeft = 0;
      row.forEach((col, colIdx) => {
        const width = col.width;
        const height = col.height;
        if (!heights[rowIdx]) {
          heights[rowIdx] = height;
        }

        if (rowIdx === 0) {
          context.drawImage(col, offsetLeft, 0);
        } else {
          let offsetTop = heights.slice(0, rowIdx).reduce((h1, h2) => h1 + h2);
          context.drawImage(col, offsetLeft, offsetTop);
        }

        offsetLeft += width;
        if (offsetLeft > widthUsed) {
          widthUsed = offsetLeft;
        }
        if (heights.reduce((h1, h2) => h1 + h2) > heightUsed) {
          heightUsed = heights.reduce((h1, h2) => h1 + h2);
        }

      });
    }
  })
}

button.addEventListener('click', function () {
  cropCanvas();
  draw(true);
});

download.onclick = function (e) {
  const imgUrl = canvas.toDataURL('image/png', 1);
  e.target.href = imgUrl;
}