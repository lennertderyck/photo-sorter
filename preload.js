// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const fs = require('fs');
const path = require('path');
const moveFile = require('move-file');
const isImage = require('is-image');
const open = require('open');

const node = (selector, multiple = false) => {
  try {
      if (multiple == false) return document.querySelector(selector);
      return document.querySelectorAll(selector);
  } catch {
      throw new Error('Node couldn\'t be found. Try a different selector or create this node if non-existing.')
  }
}

let modIndex = 0;
const photos = [];
let folderPath = '';

window.addEventListener('DOMContentLoaded', () => {  
  const pathForm = node('#selectDir');
  const controls = node('#controls');
  const counter = node('#suggestionCounter');
  
  pathForm.addEventListener('change', (event) => {
    event.preventDefault();
    let formData = new FormData(pathForm);
    folderPath = formData.get('path').path;
    listPhotos(folderPath);
  })
  
  controls.addEventListener('click', (event) => {
    const accept = event.target.closest('.moderate__btn--accept');
    const reject = event.target.closest('.moderate__btn--reject');
    
    if (accept && modIndex != photos.length) acceptSuggestion();
    if (reject && modIndex != photos.length) rejectSuggestion();
    
    if (accept && photos[photos.length-1].status != 'unset') node('#toStep3').classList.add('animate__zoomIn')
    else if (reject && photos[photos.length-1].status != 'unset') node('#toStep3').classList.add('animate__zoomIn');
  })
  
  document.addEventListener('click', (event) => {
    const transfer = event.target.closest('#transferPhotos');
    const reset = event.target.closest('[data-action="reset"]');
    const openFolder = event.target.closest('[data-action="openFolder');
    const pathInput = event.target.closest('#path');
    
    if (transfer) transferPhotos();
    if (reset) resetApp();
    if (openFolder) openPath(folderPath);
    if (pathInput) event.preventDefault();
  })
    
  const listPhotos = (folderPath) => {
    emptyPhotoList();
    const files = fs.readdirSync(folderPath);
    
    for (file of files) {
      const stat = fs.lstatSync(path.join(folderPath, file))
      if (stat.isDirectory() == false && isImage(`${folderPath}/${file}`) == true) addPhotoSuggestion(file, `${folderPath}/${file}`);
    }
    
    nextSuggestion(0);
    node('#step2').scrollIntoView();
  }

  const photoList = node('#photoList');
  const addPhotoSuggestion = (name, path) => {
    photos.push({name: name, path: path, status: 'unset'});
    
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

const nextSuggestion = (index) => {
  try {
    const curr = node('#photoList .suggestion', true)[index],
    prev = node('#photoList .suggestion', true)[index-1];
    
    curr.scrollIntoView({inline: 'center', block: 'nearest'});
    
    if (prev) prev.classList.remove('suggestion--selected');
    curr.classList.add('suggestion--selected');
    
    node('#suggestionCounter').innerHTML = suggestionCounter();
  } catch (error) {}
}

const acceptSuggestion = () => {
  photos[modIndex].status = 'accept';
  modIndex = modIndex+1;
  nextSuggestion(modIndex)
}

const rejectSuggestion = () => {
  photos[modIndex].status = 'reject';
  modIndex = modIndex+1;
  nextSuggestion(modIndex)
}

const suggestionCounter = () => {
  return `${modIndex+1} van ${photos.length}`;
}

const transferPhotos = () => {
  console.log(node('#step4'));
  
  photos.forEach((photo) => {
    console.log(folderPath, photo.name)
    if (photo.status == 'reject') moveFile(`${folderPath}/${photo.name}`, `${folderPath}/reject/${photo.name}`);
  })
  
  node('#step4').scrollIntoView({block: 'nearest'});
}

const resetApp = () => {
  modIndex = 0;
  photos.length = 0;
  console.log(modIndex, photos);
  node('#path').value = '';
  node('#step1').scrollIntoView({block: 'nearest'});
  location.reload();
  // app.relaunch();
}

const openPath = (path) => {
  console.log(path)
  open(path)
  // openExplorer(path, err => {console.log(err)});
}


