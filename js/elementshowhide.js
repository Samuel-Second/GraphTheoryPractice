function hideAllElements(elements)
{
    elements.forEach( (element) =>
    {
        hideElement(element);
    });
}

function hideElement(element)
{
    if (!isHiddenElement(element))
    {
        element.classList.add("hidden");
    }
}

function showElement(element)
{
    if (isHiddenElement(element))
    {
        element.classList.remove("hidden");
    }
}

function isHiddenElement(element)
{
    if (element.classList == undefined)
    {
        return false;
    }
    if (!element.classList.contains("hidden"))
    {
        return false;
    }
    return true;
}