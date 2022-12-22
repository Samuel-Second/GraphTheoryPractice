nodeAddBtn.onclick = () =>
{
    try
    {
        graph.generateGraph(graph.numOfNode + 1);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

nodeDelBtn.onclick = () =>
{
    try
    {
        graph.generateGraph(graph.numOfNode - 1);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

adjcRandomBtn.onclick = () =>
{
    try
    {
        graph.randomizeEdges();
    }
    catch (e)
    {
        console.log(e.message);
    }
}

adjcClearBtn.onclick = () =>
{
    try
    {
        graph.resetEdgeInputs();
        graph.generateGraph(graph.numOfNode);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

let btnPanelTable = {
    "adjc-config-btn": adjcConfigCtn,
    "path-config-btn": pathConfigCtn
}

configBtns.forEach( (btn) =>
{
    try
    {
        if (btnPanelTable[btn.id] == undefined) return;
        
        let panel = btnPanelTable[btn.id];
    
        btn.onclick = () =>
        {
            let panelPosition = btn.getBoundingClientRect();
        
            setPanelPosition(panel, panelPosition);
    
            let wasHidden = false;
            
            if (isHiddenElement(panel))
            {
                wasHidden = true;
            }
            hideAllElements(configPanels, panel.id);
    
            if (wasHidden)
            {
                showElement(panel);
                return;
            }
            hideElement(panel);
        };
    }
    catch (e)
    {
        console.log(e.message);
    }
});

/**
 * 設定視窗位置
 * @param {HTMLElement} panel 
 * @param {object} position 
 */
function setPanelPosition(panel, position)
{
    try
    {
        panel.style.top = `${position.top - 30}px`;
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 下載圖圖檔
 * @see https://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas
 * @see https://stackoverflow.com/questions/17311645/download-image-with-javascript
 */
graphImgDnldBtn.onclick = () =>
{
    try
    {
        getImgByElm(pathTextArea, 1.5, (img) =>
        {
            let canvasCtx = graph.Brush.canvas;
            let x = -25;
            let y = 850;
            let w = img.width;
            let h = img.height;
        
            canvasCtx.drawImage(img, x, y, w, h); // 將路徑資料印至 canvas 上
    
            let link = document.createElement("a");
        
            link.download = '圖.png';
            link.href     = canvasElm.toDataURL();
            link.click();
        
            canvasCtx.clearRect(x, y, w, h); // 擦除異動區域
        });
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 下載鄰接矩陣圖檔
 */
adjcImgDnldBtn.onclick = () =>
{
    try
    {
        getImgByElm(adjcTableElm, 2, (img) =>
        {
            let link = document.createElement("a");
    
            link.download = '鄰接矩陣.png';
            link.href     = img.src;
            link.click();
        });
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 下載鄰接矩陣 JSON 檔
 */
adjcDnldBtn.onclick = () =>
{
    try
    {
        if (graph.edges == undefined)
        {
            return;
        }
        let text = JSON.stringify(graph.edges);
    
        downloadAsJson("鄰接矩陣", text);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 上傳鄰接矩陣 JSON 檔
 */
adjcUpldBtn.onclick = () =>
{
    try
    {
        adjcUpldInput.click();
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 接受上傳的鄰接矩陣 JSON 檔
 * @see https://stackoverflow.com/questions/36127648/uploading-a-json-file-and-using-it
 */
adjcUpldInput.onchange = () =>
{
    try
    {
        let file = adjcUpldInput.files[0];
        let fileReader = new FileReader();
    
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = () =>
        {
            let text = fileReader.result;
            let json = JSON.parse(text);
    
            graph.setEdgeInputs(json);
        }
    }
    catch (e)
    {
        console.log(e.message);
    }
}