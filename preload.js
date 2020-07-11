// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const fs = require('fs');
const path = require('path');

const node = (selector, multiple = false) => {
  try {
      if (multiple == false) return document.querySelector(selector);
      return document.querySelectorAll(selector);
  } catch {
      throw new Error('Node couldn\'t be found. Try a different selector or create this node if non-existing.')
  }
}

window.addEventListener('DOMContentLoaded', () => {  
  const pathForm = node('#selectDir');
  
  pathForm.addEventListener('change', (event) => {
    event.preventDefault();
    let formData = new FormData(pathForm);
    listPhotos(formData.get('path').path);
  })
  
  const listPhotos = (folderPath) => {
    emptyPhotoList();
    const files = fs.readdirSync(folderPath);
    for (file of files) {
      const stat = fs.lstatSync(path.join(folderPath, file))
      if (stat.isDirectory() == false) addPhotoSuggestion(file, `${folderPath}/${file}`);
    }
    node('#step2').scrollIntoView({behavior: "smooth"});
  }
  
  const photos = [];
  const photoList = node('#photoList');
  const addPhotoSuggestion = (name, path) => {
    photos.push({name: name, path: path, status: 'keep'});
    
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.innerHTML = `
    <img class="suggestion__photo" src="${path}">
    `;
    photoList.appendChild(div);
  }
})

const emptyPhotoList = () => {
  node('#photoList').innerHTML = '';
}


