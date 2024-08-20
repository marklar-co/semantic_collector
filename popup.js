document.getElementById('collectButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: collectPageContent
            },
            (results) => {
                if (results && results[0]) {
                    const { pageContent, links } = results[0].result;
                    console.log("Page Content:", pageContent);
                    console.log("Links:", links);

                    chrome.runtime.sendMessage({
                        action: 'saveContent',
                        data: {
                            url: tabs[0].url,
                            content: pageContent,
                            links: links
                        }
                    }, response => {
                        console.log('Background script response:', response);
                    });

                    if (links.length > 1) {
                        chrome.tabs.update(tabs[0].id, { url: links[1] });
                    }
                }
            }
        );
    });
});

document.getElementById('clearButton').addEventListener('click', function () {
    chrome.runtime.sendMessage({
        action: 'clearData'
    }, response => {
        console.log('Background script response:', response);
    });
});

document.getElementById('downloadButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({
        action: 'getData'
    }, response => {
        const jsonData = JSON.stringify(response.contentDictionary, null, 2); // pretty-print
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
            url: url,
            filename: 'collection.json',
            saveAs: true
        }, () => {
            URL.revokeObjectURL(url);
            console.log('Content dictionary downloaded as collection.json');
        });
    });
});

function collectPageContent() {
    const pageContent = document.body.innerHTML;
    const links = Array.from(document.querySelectorAll('a')).map(link => link.href);
    return { pageContent, links };
}
