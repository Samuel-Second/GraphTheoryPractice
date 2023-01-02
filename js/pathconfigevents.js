algorithmSlct.oninput = () => updatePathInput();

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

pathInputStart.onwheel = pathInputEnd.onwheel = (e) =>
{
    inputWheelEvent(e);
    pathInputEvent(e);
}

pathInputStart.oninput = pathInputEnd.oninput = (e) => pathInputEvent(e);

function pathInputEvent(e)
{
    e.target.value = graph.getValidNode(e.target.value)
    
    graph.startNode = pathInputStart.value;
    graph.endNode   = pathInputEnd.value;
    
    graph.renderGraph();
}

updatePathInput();