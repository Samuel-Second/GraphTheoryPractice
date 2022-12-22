adjcConfigMinEdge.onchange = () => updateEdgeMin();

adjcConfigMaxEdge.onchange = () => updateEdgeMax();

adjcConfigEdgeDensity.onchange = () => updateEdgeDensity();

/**
 * 更新邊最小值
 */
function updateEdgeMin()
{
    try
    {
        let value = getValidEdge(adjcConfigMinEdge.value, 0, 999);
        
        if (value == -1) return;
    
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
        let value = getValidEdge(adjcConfigMaxEdge.value, 0, 999);
        
        if (value == -1) return;
    
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
        let value = getValidEdge(adjcConfigEdgeDensity.value, 0, 100);
        
        if (value == -1) return;
    
        graph.edgeDensity = value;
    
        adjcConfigEdgeDensity.value = value;
        
        configStorage.setEdgeDensity(value);
    }
    catch (e)
    {
        console.log(e.message);
    }
}

/**
 * 取得有效的邊值
 */
function getValidEdge(value, min, max)
{
    try
    {
        if (isNaN(value))
        {
            return -1;
        }
        value = parseInt(value);

        if (value < min)
        {
            return min;
        }
        else if (value > max)
        {
            return max;
        }
        return value;
    }
    catch (e)
    {
        console.log(e.message);
    }
}

updateEdgeMin();
updateEdgeMax();
updateEdgeDensity();