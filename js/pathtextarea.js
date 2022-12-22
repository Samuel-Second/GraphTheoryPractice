class PathTextArea
{
    position;

    ALGORITHM_NAMES = {
        "none"     : "無演算法",
        "dijkstra" : "最短路徑 - 戴克斯特拉演算法",
        "tspHybrid": "圖遍歷 - 混合演算法",
        "tspNn"    : "圖遍歷 - 最近距離搜索演算法",
        "mst"      : "最小生成樹 - 貪婪演算法"
    };

    constructor(pathTextArea)
    {
        this.pathTextArea = pathTextArea;

        let position = pathTextArea.getBoundingClientRect();

        this.position = {
            x: position.left,
            y: position.top
        };
    }

    /**
     * 清空文字欄
     */
    clear()
    {
        this.pathTextArea.innerHTML = "";
    }

    /**
     * 印出文字
     * @param {string} text 
     */
    printLine(text)
    {
        if (this.pathTextArea.innerHTML == undefined)
        {
            this.pathTextArea.innerHTML = "";
        }
        this.pathTextArea.innerHTML += `${text}<br>`;
    }

    /**
     * 印出路徑資料
     * @param {object} data
     * @returns 
     */
    printPathData(data)
    {
        if (data == null) return;

        this.clear();

        let algorithm = data.algorithm;
        let path      = data.path;
        let edges     = data.edges;
        let distance  = data.distance;
        let separated = data.separated;

        this.printAlgorithm(algorithm);

        if (algorithm == "mst")
        {
            this.printTree(edges);
        }
        else if (path.length < 2)
        {
            this.printNoPath();
        }
        else
        {
            this.printPath(path, distance);
        }
        this.printDistance(distance);

        if (algorithm != "dijkstra" && separated.length)
        {
            this.printSeparatedNodes(separated);
        }
    }

    /**
     * 印出演算法
     * @param {string} algorithm
     */
    printAlgorithm(algorithm)
    {
        if (this.ALGORITHM_NAMES[algorithm] == undefined)
        {
            this.printLine(`演算法：錯誤`);
            return;
        }
        this.printLine(`演算法：${this.ALGORITHM_NAMES[algorithm]}`);
    }

    /**
     * 印出路徑
     * @param {array} path
     */
    printPath(path)
    {
        let text = "路徑：";

        for (let i = 0; i < path.length - 1; i++) // 繪製路徑
        {
            text += `${path[i]} → `;
        }
        text += `${path[path.length-1]}。`;

        this.printLine(text);
    }

    /**
     * 印出「查無路徑」
     */
    printNoPath()
    {
        this.printLine("路徑：查無路徑");
    }

    /**
     * 印出總長度
     * @param {float} distance
     */
    printDistance(distance)
    {
        this.printLine(`總長度：${distance}。`);
    }

    printDisconnectedPath()
    {
        this.printLine("無法取得最短路徑。");
    }

    /**
     * 印出分離節點
     * @param {array} separatedNodes 
     */
    printSeparatedNodes(separatedNodes)
    {
        let text = "無法遍歷圖，分離節點：";

        for (let i = 0; i < separatedNodes.length - 1; i++) // 繪製路徑
        {
            text += `${separatedNodes[i]}、`;
        }
        text += `${separatedNodes[separatedNodes.length-1]}。`;

        this.printLine(text);
    }

    printTree(edges)
    {
        let text = "樹結構：";

        let tree = [];

        edges.forEach( (edge) =>
        {
            if (tree[edge.fromNode] == undefined)
            {
                tree[edge.fromNode] = [];
            }
            tree[edge.fromNode].push(edge.toNode);
        });
        for (let i = 0; i < tree.length; i++)
        {
            let root = i;
            let branches = tree[i];

            if (branches == undefined) continue;

            text += `${root} → `;

            for (let j = 0; j < branches.length -1; j++)
            {
                text += `${branches[j]}、`;
            }
            text += `${branches[branches.length -1]}；　`;
        }
        this.printLine(text);
    }
}