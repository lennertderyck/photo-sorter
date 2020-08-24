import {Api, eventCallback, node} from 'https://unpkg.com/cutleryjs/dist/js/index.js'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const platform = urlParams.get('platform');
// const version = urlParams.get('v');

window.addEventListener('click', () => {
    eventCallback('historyBack', () => {
        window.history.back();
    })
})

const core = {
    async init() {
       const version = await core.getCurrentVersion();
       if (platform) core.redirect(version, platform);
       if (!platform) core.errorMessage();
    },
    
    async getCurrentVersion() {
        const response = await new Api('https://raw.githubusercontent.com/lennertderyck/photo-sorter/master/package.json')
        const data = await response.JSON();
        return data.version;
    },
    
    redirect(version, platform) {
        window.location.replace(`https://github.com/lennertderyck/photo-sorter/releases/download/v${version}/Photo.Sorter-${platform}-x64.zip`)
    },
    
    errorMessage() {
        const $error = node('[data-label="errorMsg"]')
        $error.innerHTML = 'Er werd geen platform toegewezen,<br>voeg ?platform=darwin of ?platform=win32 toe aan url'
    }
}

core.init();