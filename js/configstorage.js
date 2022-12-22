class ConfigStorage
{
    defaultNumOfNode  = 9;
    defaultEdgeMin    = 0;
    defaultEdgeMax    = 999;
    defaultEdgeDensity = 70;
    defaultAlgorithm  = "none";

    ITEM_DEFAULT_TABLE = {
        "numOfNode" : this.defaultNumOfNode,
        "edgeMin"   : this.defaultEdgeMin,
        "edgeMax"   : this.defaultEdgeMax,
        "edgeDensity": this.defaultEdgeDensity,
        "algorithm" : this.defaultAlgorithm
    };

    setNumOfNode(value)
    {
        value = this.getParsedValue("numOfNode", value);

        localStorage.setItem("numOfNode", value);
    }

    getNumOfNode()
    {
        return this.getItemOrDefault("numOfNode", true);
    }

    setEdgeMin(value)
    {
        value = this.getParsedValue("edgeMin", value);
        
        localStorage.setItem("edgeMin", value);
    }

    getEdgeMin()
    {
        return this.getItemOrDefault("edgeMin", true);
    }

    setEdgeMax(value)
    {
        value = this.getParsedValue("edgeMax", value);
        
        localStorage.setItem("edgeMax", value);
    }

    getEdgeMax()
    {
        return this.getItemOrDefault("edgeMax", true);
    }

    setEdgeDensity(value)
    {
        value = this.getParsedValue("edgeDensity", value);
        
        localStorage.setItem("edgeDensity", value);
    }

    getEdgeDensity()
    {
        return this.getItemOrDefault("edgeDensity", true);
    }

    setAlgorithm(value)
    {
        localStorage.setItem("algorithm", value);
    }

    getAlgorithm()
    {
        return this.getItemOrDefault("algorithm");
    }

    getParsedValue(itemName, value)
    {
        value = parseInt(value);

        if (isNaN(value))
        {
            value = this.ITEM_DEFAULT_TABLE[itemName]
        }
        return value;
    }

    getItemOrDefault(itemName, isNumber = false)
    {
        if (localStorage.getItem(itemName) == null)
        {
            let itemDefaultValue = this.ITEM_DEFAULT_TABLE[itemName];

            localStorage.setItem(itemName, itemDefaultValue);
        }
        let value = localStorage.getItem(itemName);

        if (isNumber && !isNaN(value))
        {
            value = parseInt(value);
        }
        return value;
    }

    clearItem(itemName)
    {
        localStorage.removeItem(itemName);
    }
}