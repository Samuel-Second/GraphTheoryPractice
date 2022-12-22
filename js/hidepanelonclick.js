document.onclick = (e) =>
{
    let target = e.target;

    if (target.classList.contains("config-panels")) return;
    if (target.id == "adjc-config-btn") return;
    if (target.id == "path-config-btn") return;

    for (let panel of configPanels)
    {
        if (panel.classList.contains("hidden")) continue;
        if (panel.contains(target)) continue;

        hideElement(panel);
    }
}