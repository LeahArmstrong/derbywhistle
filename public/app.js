const socket = io();

const enablePenaltyImage = document.getElementById('enablePenaltyImage');
const enablePenaltyName = document.getElementById('enablePenaltyName');

enablePenaltyImage.addEventListener('change', () => {
  localStorage.setItem("enablePenaltyImage", enablePenaltyImage.checked);
  socket.emit('requestUpdate');
});
enablePenaltyName.addEventListener('change', () => {
  localStorage.setItem("enablePenaltyName", enablePenaltyName.checked);
  socket.emit('requestUpdate');
});

socket.on('update', (data) => {
  const penaltyColumn = document.getElementById('penaltyColumn');
  const penaltyText = document.getElementById('penaltyText');
  const penaltyImage = document.getElementById('penaltyImage');

  const playerColumn = document.getElementById('playerColumn');

  setPenaltyImage(penaltyImage, data);
  setPenaltyName(penaltyText, data);

  playerColumn.style.backgroundColor = data.color;
  ensureTextVisibility(playerColumn);
  playerColumn.textContent = data.number;
});

function setPenaltyImage(element, data) {
  const savedState = localStorage.getItem("enablePenaltyImage");
  if (savedState) {
    enablePenaltyImage.checked = savedState === "true";
  }
  if (enablePenaltyImage.checked) {
    element.classList.remove('hidden');
    element.src = `images/${data.penalty.letter}.gif`;
  } else {
    element.classList.add('hidden');
  }
}

function setPenaltyName(element, data) {
  const savedState = localStorage.getItem("enablePenaltyName");
  if (savedState) {
    enablePenaltyName.checked = savedState === "true";
  }
  if (enablePenaltyName.checked) {
    element.textContent = `${data.penalty.name} (${data.penalty.letter})`;
  } else {
    element.textContent = `${data.penalty.letter}`;
  }
}

function ensureTextVisibility(element) {
  const bgColor = getComputedStyle(element).backgroundColor;
  const luminance = calculateLuminance(bgColor);

  if (luminance < 0.5) {
    element.style.color = "white";
  } else {
    element.style.color = "black";
  }
}

function calculateLuminance(color) {
  const rgb = color
        .replace(/[^\d,]/g, "")
        .split(",")
        .map(Number);

  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}


