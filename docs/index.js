import {Api} from 'https://unpkg.com/cutleryjs/dist/js/index.js'

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const platform = urlParams.get('platform');
// const version = urlParams.get('v');

const core = {
    async init() {
       const version = await core.getCurrentVersion();
       core.redirect(version, platform);
    },
    
    async getCurrentVersion() {
        const response = await new Api('https://raw.githubusercontent.com/lennertderyck/photo-sorter/master/package.json')
        const data = await response.JSON();
        return data.version;
    },
    
    redirect(version, platform) {
        window.location.replace(`https://github.com/lennertderyck/photo-sorter/releases/download/v${version}/Photo.Sorter-${platform}-x64.zip`)
    }
}

core.init();