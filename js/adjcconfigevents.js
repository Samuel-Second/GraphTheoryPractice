adjcConfigMinEdge.oninput = () => updateEdgeMin();

adjcConfigMinEdge.onwheel = (e) =>
{
    inputWheelEvent(e);
    updateEdgeMin();
}

adjcConfigMaxEdge.oninput = () => updateEdgeMax();

adjcConfigMaxEdge.onwheel = (e) =>
{
    inputWheelEvent(e);
    updateEdgeMax();
}

adjcConfigEdgeDensity.oninput = () => updateEdgeDensity();

adjcConfigEdgeDensity.onwheel = (e) =>
{
    inputWheelEvent(e);
    updateEdgeDensity();
}

/**
 * 更新邊最小值
 */
function updateEdgeMin()
{
    try
    {
        let value = getNumberWithin(adjcConfigMinEdge.value, 0, 999);
        
        if (value == "")
        {
            value = 0;
        }
        if (value > parseInt(adjcConfigMaxEdge.value))
        {
            value = adjcConfigMaxEdge.value;
        }
        graph.edgeMin = value;
    
        adjcConfigMinEdge.value = value;
    
        configStorage.setEdgeMin(value); 
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 更新邊最大值
 */
function updateEdgeMax()
{
    try
    {
        let value = getNumberWithin(adjcConfigMaxEdge.value, 0, 999);
        
        if (value == "")
        {
            value = 999;
        }
        if (value < parseInt(adjcConfigMinEdge.value))
        {
            value = adjcConfigMinEdge.value;
        }
        graph.edgeMax = value;
    
        adjcConfigMaxEdge.value = value;
        
        configStorage.setEdgeMax(value);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 更新邊隨機分散度
 */
function updateEdgeDensity()
{
    try
    {
        let value = getNumberWithin(adjcConfigEdgeDensity.value, 0, 100);
        
        if (value == "")
        {
            value = 0;
        };
        graph.edgeDensity = value;
    
        adjcConfigEdgeDensity.value = value;
        
        configStorage.setEdgeDensity(value);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

updateEdgeMin();
updateEdgeMax();
updateEdgeDensity();