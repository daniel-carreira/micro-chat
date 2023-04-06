var socket = io(`ws://localhost:8000`);

var messages = document.getElementById('messages');
var formText = document.getElementById('form-text');
var formImage = document.getElementById('form-image');
var inputText = document.getElementById('input-text');
var inputImage = document.getElementById('input-image');

function isImageUrl(url) {
  return url.startsWith('http');
}

socket.on('chat', (msg) => {
  const node = document.createElement('li');

  const msgIsImage = isImageUrl(msg)
  if (msgIsImage) {
    const imgNode = document.createElement('img');
    imgNode.src = msg;
    node.appendChild(imgNode);
  }
  else {
    const textnode = document.createTextNode(msg);
    node.appendChild(textnode);
  }

  messages.appendChild(node);
});

inputImage.addEventListener('change', () => {
  if (inputImage.files.length > 0) {
    const file = inputImage.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const blob = new Blob([event.target.result], { type: file.type });
      socket.emit('image', blob);
    };
    reader.readAsArrayBuffer(file);
  }
});

formText.addEventListener('submit', function (e) {
  e.preventDefault();
  if (inputText.value) {
    socket.emit('chat', inputText.value);
    inputText.value = '';
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
});