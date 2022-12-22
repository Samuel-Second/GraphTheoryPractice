algorithmSlct.onchange = () => updatePathInput();

function updatePathInput()
{
    hideElement(pathInputStartCtn);
    hideElement(pathInputEndCtn);

    configStorage.setAlgorithm(algorithmSlct.value);

    if (algorithmSlct.value == "dijkstra")
    {
        showElement(pathInputStartCtn);
        showElement(pathInputEndCtn);
    }
    graph.generateGraph(graph.numOfNode);
}

pathInputStart.onchange = pathInputEnd.onchange = (e) =>
{
    e.target.value = graph.getValidNode(e.target.value)
    
    graph.startNode = pathInputStart.value;
    graph.endNode   = pathInputEnd.value;
    
    graph.renderGraph();
}

updatePathInput();