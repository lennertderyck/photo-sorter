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
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.setAttribute('data-status','unset');
    div.innerHTML = `
      <img class="suggestion__photo" src="${path}">
      <div class="moderate__status">
        <i class='bx bx-like' ></i>
        <i class='bx bx-dislike' ></i>
      </div>
    `;
    photoList.appendChild(div);
    photos.push({name: name, path: path, status: 'unset', el: div});
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
  photos[modIndex].el.setAttribute('data-status','accept');
  modIndex = modIndex+1;
  nextSuggestion(modIndex);
}

const rejectSuggestion = () => {
  photos[modIndex].status = 'reject';
  photos[modIndex].el.setAttribute('data-status','reject');
  modIndex = modIndex+1;
  nextSuggestion(modIndex)
}

const suggestionCounter = () => {
  return `${modIndex+1} van ${photos.length}`;
}

const transferPhotos = () => {
  const foldernames = {accept: node('#folderNameAccept').value, reject: node('#folderNameReject').value}
  photos.forEach((photo) => {
    if (photo.status == 'reject') moveFile(`${folderPath}/${photo.name}`, `${folderPath}/${foldernames.reject}/${photo.name}`)
    else if (photo.status == 'accept') moveFile(`${folderPath}/${photo.name}`, `${folderPath}/${foldernames.accept}/${photo.name}`);
  })
  
  node('#step4').scrollIntoView({block: 'nearest'});
}

const resetApp = () => {
  modIndex = 0;
  photos.length = 0;
  node('#path').value = '';
  node('#step1').scrollIntoView({block: 'nearest'});
  location.reload();
  // app.relaunch();
}

const openPath = (path) => {
  open(path)
}


