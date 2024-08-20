document.getElementById('collectButton').addEventListener('click', function () {
    const inclusionPattern = document.getElementById('inclusionPattern').value;
    const excludedLinks = document.getElementById('excludedLinks').value.split(',').map(link => link.trim());

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: collectPageContent,
                args: [inclusionPattern, excludedLinks]
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

document.getElementById('downloadButton').addEventListener('click', function () {
    chrome.runtime.sendMessage({
        action: 'getData'
    }, response => {
        if (response && response.contentDictionary) {
            const jsonData = JSON.stringify(response.contentDictionary, null, 2); // prettify? this doesn't seem to work...?
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
        } else {
            console.error('Failed to get content dictionary from background script');
        }
    });
});

function collectPageContent(inclusionPattern, excludedLinks) {
    const pageContent = document.body.innerHTML;
    const links = Array.from(document.querySelectorAll('a'))
        .map(link => link.href)
        .filter(link => {
            const matchesPattern = new RegExp(inclusionPattern).test(link);
            const isExcluded = excludedLinks.includes(link);
            const isAnchorLink = /#.*$/.test(link);
            return matchesPattern && !isExcluded && !isAnchorLink;
        });
    return { pageContent, links };
}
