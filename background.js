let linksList = [];
let contentDictionary = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveContent') {
        saveContent(request.data);
        sendResponse({ status: 'success' });
    } else if (request.action === 'clearData') {
        clearData();
        sendResponse({ status: 'success' });
    } else if (request.action === 'getData') {
        sendResponse({ contentDictionary: contentDictionary });
    }
});

function saveContent(data) {
    console.log('Saving content:', data);

    linksList = Array.from(new Set(linksList.concat(data.links)));
    console.log('Updated links list:', linksList);

    contentDictionary[data.url] = data.content;
    console.log('Updated content dictionary:', contentDictionary);
}

function clearData() {
    linksList = [];
    contentDictionary = {};
    console.log('Cleared links list and content dictionary');
}
