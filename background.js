let linksList = [];
let visitedLinksList = [];
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
    } else if (request.action === 'getNextLink') {
        const nextLink = getNextLink();
        console.log('Next link:', nextLink);
        sendResponse({ nextLink: nextLink });
    } else if (request.action === 'isVisitedLink') {
        const isVisited = visitedLinksList.includes(request.url);
        sendResponse({ isVisited: isVisited });
    }
});

function saveContent(data) {
    console.log('Saving content:', data);

    if (!data.url || !data.content || !data.links) {
        console.error('Invalid data:', data);
        return;
    }

    linksList = Array.from(new Set(linksList.concat(data.links)));
    console.log('Updated links list:', linksList);

    contentDictionary[data.url] = data.content;
    console.log('Updated content dictionary:', contentDictionary);

    visitedLinksList.push(data.url);
    console.log('Updated visited links list:', visitedLinksList);
}

function getNextLink() {
    let nextLink = null;
    while (linksList.length > 0) {
        nextLink = linksList.pop();
        if (!visitedLinksList.includes(nextLink)) {
            break;
        }
        nextLink = null;
    }
    return nextLink;
}

function clearData() {
    linksList = [];
    visitedLinksList = [];
    contentDictionary = {};
    console.log('Cleared links list, visited links list, and content dictionary');
}
