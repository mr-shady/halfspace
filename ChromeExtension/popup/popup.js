document.addEventListener('DOMContentLoaded', async () => {
    const editor = document.getElementById('editor');
    const resDiv = document.getElementById('res');
    const copyBtn = document.getElementById('copyBtn');
    const fixBtn = document.getElementById('fixBtn');

    const charCountEl = document.getElementById('charCount');
    const wordCountEl = document.getElementById('wordCount');
    const sentenceCountEl = document.getElementById('sentenceCount');
    const readTimeEl = document.getElementById('readTime');
  
    const updateStats = () => {
        const text = editor.innerText || "";
        const charCount = text.length;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const sentenceCount = (text.match(/[.?!؟!;]+/g) || []).length;

        const readingTimeSeconds = Math.ceil(wordCount / 3.5); 
        let readingTimeText = "";
        if (readingTimeSeconds < 60) {
            readingTimeText = `${readingTimeSeconds} ثانیه`;
        } else {
            const mins = Math.floor(readingTimeSeconds / 60);
            readingTimeText = `${mins} دقیقه`;
        }
  
        charCountEl.innerText = charCount;
        wordCountEl.innerText = wordCount;
        sentenceCountEl.innerText = sentenceCount;
        readTimeEl.innerText = readingTimeText;
    };

    const loadSelectedText = async () => {
      try {
          // Changed browser to chrome
          const storedData = await chrome.storage.local.get("otomatn_content");
          
          if (storedData.otomatn_content) {
              editor.innerHTML = storedData.otomatn_content;
              
              // Changed browser to chrome
              await chrome.storage.local.remove("otomatn_content");
              
              fixContent(); 
              updateStats(); 
              return; 
          }
      } catch (e) {
          console.log("Storage error:", e);
      }

      // Changed browser to chrome
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  
      try {
        // Changed browser to chrome
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const container = document.createElement("div");
              container.appendChild(selection.getRangeAt(0).cloneContents());
              return container.innerHTML;
            }
            return "";
          },
        });
  
        // Chrome returns an array of injection results
        if (results && results[0] && results[0].result && results[0].result.length > 0) {
          editor.innerHTML = results[0].result;
          fixContent(); // Auto-fix on load
        }
      } catch (e) {
        // console.log("No access or empty selection");
      }
      // Update stats after loading
      updateStats();
    };
  
    // 2. Fix content logic (Walks through text nodes)
    const fixContent = () => {
      const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
  
      let node;
      while (node = walker.nextNode()) {
        if (node.nodeValue.trim().length > 0) {
            // Assuming FixGrammar is loaded globally via HTML script tag
            const fixer = new FixGrammar(node.nodeValue);
            node.nodeValue = fixer.get();
        }
      }
      
      resDiv.innerHTML = '<div class="alert alert-info p-1" style="font-size:12px; margin-bottom:5px;">متن اتو شد!</div>';
      setTimeout(() => { resDiv.innerHTML = ''; }, 2000);
      
      updateStats();
    };
  
    const copyToClipboard = () => {
      const range = document.createRange();
      range.selectNodeContents(editor);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  
      document.execCommand('copy');
      
      selection.removeAllRanges();
      
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'کپی شد!';
      copyBtn.className = 'btn btn-warning';
      
      setTimeout(() => {
          copyBtn.innerText = originalText;
          copyBtn.className = 'btn btn-success';
      }, 1500);
    };

    fixBtn.addEventListener('click', fixContent);
    copyBtn.addEventListener('click', copyToClipboard);
    
    editor.addEventListener('input', updateStats);
  
    loadSelectedText();
});