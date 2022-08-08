document.addEventListener('DOMContentLoaded', async() => {
  const resDiv = document.getElementById('res');
  const TextArea = document.getElementById('textarea');
  const copyBtn = document.getElementById('copyBtn');

  const StartCurrection = async () => {
    let SelectedText = GetSelected();
    
   
  }
  const GetSelected = async () => {

    resDiv.innerHTML = '';
    TextArea.value = '';
    TextArea.style.display = 'none';
    copyBtn.style.display = 'none';
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});

      let result;
      try {
        [{result}] = await browser.scripting.executeScript({
          target: {
            tabId: tab.id,
          },
          func: () => {return getSelection().toString()},
        });
      } catch (e) {
        return; // ignoring an unsupported page like chrome://extensions
      }
      if(result.length > 0){
        const Fix = new FixGrammar(result.toString());
        TextArea.value = Fix.get();
        TextArea.style.display = 'block';
        copyBtn.style.display = 'block';
      }else{
        resDiv.innerHTML = `<div class="alert alert-danger">متنی انتخاب نشده است.</div>`;
      }
  }
  const copy = () => {
    TextArea.select();
    document.execCommand('copy');
    copyBtn.innerText = `کپی شد!`;
    copyBtn.className = 'btn btn-primary pull-left';
  }
  document.getElementById('copyBtn').addEventListener('click', () => {
    copy();
  });
  window.onload = function() {
    StartCurrection()
  };

});