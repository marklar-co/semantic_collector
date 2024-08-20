document.getElementById('collectButton').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: collectPageContent
        },
        (results) => {
          if (results && results[0]) {
            const { pageContent, links } = results[0].result;
            console.log("xxx page content:", pageContent);
            console.log("xxx links queue:", links);

            if (links.length > 1) {
                chrome.tabs.update(tabs[0].id, { url: links[1] });
            }
          }
        }
      );
    });
  });
  
  function collectPageContent() {
    const pageContent = document.body.innerHTML;
    const links = Array.from(document.querySelectorAll('a')).map(link => link.href);
    return { pageContent, links };
  }