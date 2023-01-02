document.onkeydown = (e) =>
{
    if (hasFocusOnInput()) return;

    let key = getBtnByKey(e.code);
    
    if (key == undefined) return;

    let background = key.parentElement;

    cancelAllInputFocus();
    
    key.classList.add("pressed");
    background.classList.add("pressed");
    
};

document.onkeyup = (e) =>
{
    if (hasFocusOnInput()) return;

    let key = getBtnByKey(e.code);
    
    if (key == undefined) return;

    let background = key.parentElement;

    cancelAllInputFocus();

    key.classList.remove("pressed");
    background.classList.remove("pressed");

    key.click();
};

/**
 * 取得指定名稱的按鈕
 * @param {string} keyName
 * @returns {object}
 */
function getBtnByKey(keyName)
{
    switch (keyName)
    {
        case "NumpadAdd":
            return nodeAddBtn;
        case "Equal":
            return nodeAddBtn;
        case "NumpadSubtract":
            return nodeDelBtn;
        case "Minus":
            return nodeDelBtn;
        case "KeyR":
            return adjcRandomBtn;
        case "KeyC":
            return adjcClearBtn;
        case "KeyA":
            return adjcConfigBtn;
        case "KeyP":
            return pathConfigBtn;
        default:
            return undefined;
    }
}

function cancelAllInputFocus()
{
    for(let input of allInputs)
    {
        input.blur();
    }
}

function hasFocusOnInput()
{
    if (document.activeElement.tagName.toLowerCase() == "input")
    {
        return true;
    }
    return false;
}