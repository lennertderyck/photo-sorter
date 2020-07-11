const node = (selector, multiple = false) => {
    try {
        if (multiple == false) return document.querySelector(selector);
        return document.querySelectorAll(selector);
    } catch {
        throw new Error('Node couldn\'t be found. Try a different selector or create this node if non-existing.')
    }
}

export {node};