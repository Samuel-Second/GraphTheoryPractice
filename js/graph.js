class Graph{
    
    Brush; // 筆刷類別

    PathTextArea; // 顯示版

    graphRadius = 380;

    adjcTable; // 鄰接矩陣表格

    nodes; // 節點陣列

    numOfNode;

    nodeMax = 18;

    nodeMin = 1;

    edges; // 鄰接矩陣

    edgeInputs; // 輸入框元素陣列

    edgeDensity = 70; // 邊隨機分散度

    edgeMin = 0; // 邊最小值

    edgeMax = 999; // 邊最大值

    dijkstraCache; // 最短路徑快取

    constructor()
    {
        this.nodes = [];

        this.Brush        = new Brush(canvasElm);
        this.PathTextArea = new PathTextArea(pathTextArea);
        this.tspStats     = new TspStats();
        this.adjcTable    = adjcTableElm;
    }

    /**
     * 生成圖
     * @param {int} numOfNode 
     */
    generateGraph(numOfNode)
    {
        try
        {
            if (!this.isValidNumOfNode(numOfNode)) return;
    
            this.numOfNode = numOfNode;
    
            configStorage.setNumOfNode(numOfNode);
    
            this.updateAdjcTable(this.numOfNode);
            
            this.renderGraph();
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 回傳節點數是否有效
     * @param {int} numOfNode 
     * @returns {bool}
     */
    isValidNumOfNode(numOfNode)
    {
        try
        {
            if (isNaN(numOfNode))
            {
                return false;
            }
            if (numOfNode < this.nodeMin || numOfNode > this.nodeMax)
            {
                return false;
            }
            return true;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 動態更新鄰接矩陣
     */
    updateAdjcTable()
    {
        try
        {
            let numOfRow = this.numOfNode + 1; // 表格應有的行數（加一是因為包含了標題）
    
            let table = this.adjcTable;
    
            while (table.rows.length < numOfRow) // 若表格的行數小於應有的行數
            {
                table.insertRow(-1);
            }
            while (table.rows.length > numOfRow) // 若表格的行數大於應有的行數
            {
                table.deleteRow(-1);
            }
            for (let i = 0; i < numOfRow; i++)
            {
                while (table.rows[i].cells.length < numOfRow) // 若表格第 i 行的列數小於應有的列數
                {
                    this.addCell(i);
                }
                while (table.rows[i].cells.length > numOfRow) // 若表格第 i 行的列數大於應有的列數
                {
                    this.delCell(i);
                }
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 新增指定行數的格子
     * @param {int} rowIndex 
     */
    addCell(rowIndex)
    {
        try
        {
            let row       = this.adjcTable.rows[rowIndex];
            let cellIndex = row.cells.length
            let cell      = row.insertCell(-1);
    
            cell.id = `grid-${rowIndex}-${cellIndex}`;
    
            if (rowIndex == 0 || cellIndex == 0) // 若行數或列數為零
            {
                cell.className = "adjacency-node";
            }
            else if (rowIndex != cellIndex)
            {
                let cellInput  = this.getCellInput(rowIndex, cellIndex)
                cell.className = "adjacency-edge";
                cell.appendChild(cellInput);
            }
            else
            {
                cell.className = "adjacency-none"
            }
            if (rowIndex == 0 && cellIndex != 0) // 若行數為 0 且列數不為 0
            {
                cell.innerHTML = parseInt(cellIndex) - 1;
            }
            else if (cellIndex == 0 && rowIndex != 0) // 若列數為 0 且行數不為 0
            {
                cell.innerHTML = parseInt(rowIndex) - 1;
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 刪除指定行數的格子
     * @param {int} rowIndex 
     */
    delCell(rowIndex)
    {
        try
        {
            this.adjcTable.rows[rowIndex].deleteCell(-1);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得格子的輸入元素
     * @param {int} rowIndex 
     * @param {int} cellIndex 
     * @returns {element} 輸入元素
     */
    getCellInput(rowIndex, cellIndex)
    {
        try
        {
            let cellInput = document.createElement("input");
    
            cellInput.id        = `adjacency-${rowIndex}-${cellIndex}`;
            cellInput.className = "adjacency-edge-input";
            cellInput.maxLength = 3;
            cellInput.setAttribute("from-node", parseInt(rowIndex) - 1);
            cellInput.setAttribute("to-node", parseInt(cellIndex) - 1);
            cellInput.onwheel = (e) =>
            {
                inputWheelEvent(e);
                this.renderGraph();
            }
            cellInput.oninput = cellInput.onkeyup = () => this.renderGraph();
    
            return cellInput;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 渲染圖
     */
    renderGraph()
    {
        try
        {
            this.Brush.clearCanvas();
            
            this.drawNodes();

            this.edgeInputFilter();
    
            this.drawEdges();
    
            let pathData = null;
    
            this.dijkstraCache = []; // 重置最短路徑快取
    
            switch (algorithmSlct.value)
            {
                case "none":
                    pathData = this.getPathDataDefault();
                    break;
                case "dijkstra":
                    pathData = this.dijkstra();
                    break;
                case "tsp":
                    pathData = this.tsp();
                    break;
                case "mst":
                    pathData = this.mst();
                    break;
            }
            if (pathData == null) return;
    
            this.drawPath(pathData);
    
            this.PathTextArea.clear();
            this.PathTextArea.printPathData(pathData);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    edgeInputFilter()
    {
        try
        {
            this.edgeInputs = document.querySelectorAll(".adjacency-edge-input");
    
            this.resetEdges();

            for(let i = 0; i < this.edgeInputs.length; i++)
            {
                this.edgeInputs[i].value = getNumberWithin(this.edgeInputs[i].value, 0, 999);

                if (this.edgeInputs[i].value == "") continue;

                let fromNodeId = parseInt(this.edgeInputs[i].getAttribute("from-node"));
                let toNodeId   = parseInt(this.edgeInputs[i].getAttribute("to-node"));

                this.edges[fromNodeId][toNodeId] = parseInt(this.edgeInputs[i].value);
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 新增指定數量的節點
     * @see https://www.w3resource.com/javascript-exercises/javascript-math-exercise-33.php
     */
    drawNodes()
    {
        try
        {
            let center = this.getCanvasCenter();
    
            let angleGap = 360 / this.numOfNode; // 取得平均分散的節點之間的角度
            
            this.Brush.setTextSize(30);
            this.Brush.setTextAlign(5);
    
            for (let i = 0; i < this.numOfNode; i++)
            {
                let nodeAngle = angleGap * i - 90; // 節點所在角度（-90 為校正角度至正上方）
                let theta     = nodeAngle * ( Math.PI / 180 ) ; // 將節點所在角度 轉換為 弧度
                let x         = center.x + Math.cos(theta) * this.graphRadius;  // 中心 x 座標 + cosθ * r = 節點所在 x 座標
                let y         = center.y + Math.sin(theta) * this.graphRadius;  // 中心 y 座標 + sinθ * r = 節點所在 y 座標
                this.drawNode(x, y, i);
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得畫布中心座標
     * @returns {object}
     */
    getCanvasCenter()
    {
        try
        {
            return {
                x: this.Brush.canvasWidth / 2,
                y: this.Brush.canvasHeight / 2 - 75
            };
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 建立節點
     * @param {int} x 
     * @param {int} y 
     * @param {int} id 
     */
    drawNode(x, y, id)
    {
        try
        {
            this.Brush.drawCircle(x, y, "black", 1);
            this.Brush.drawText(x, y, id);
            this.nodes[id] = {
                id: id,
                x: x,
                y: y
            };
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 繪製邊並更新鄰接矩陣
     */
    drawEdges()
    {
        try
        {
            for (let edgeInput of this.edgeInputs)
            {
                if (edgeInput.value == "") continue;
    
                let transparacy = this.getTransparacy(parseInt(edgeInput.value));
                let fromNodeId  = parseInt(edgeInput.getAttribute("from-node"));
                let toNodeId    = parseInt(edgeInput.getAttribute("to-node"));
                let fromNode    = this.nodes[fromNodeId];
                let toNode      = this.nodes[toNodeId];
    
                this.Brush.drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y, `rgba(0, 0, 0, ${transparacy})`);
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 繪製路徑
     * @param {object} data
     */
    drawPath(data)
    {
        try
        {
            for (let node of data.nodes)
            {
                if (node == null) continue;

                let nodeObj = this.nodes[node];
                this.Brush.drawCircle(nodeObj.x, nodeObj.y, "red", 2); // 繪製起點
            };
            let edges = data.edges;

            for (let edge of edges)
            {
                let fromNode = this.nodes[edge.fromNode];
                let toNode   = this.nodes[edge.toNode];
                this.Brush.drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y, "red", 2);
            };
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 隨機化鄰接矩陣
     */
    randomizeEdges()
    {
        try
        {
            this.edgeInputs.forEach( edge =>
            {
                let fromNodeId = parseInt(edge.getAttribute("from-node"));
                let toNodeId   = parseInt(edge.getAttribute("to-node"));
    
                if (this.flipCoin(this.edgeDensity) > 0 && fromNodeId != toNodeId)
                {
                    edge.value = this.getRandomNum(this.edgeMin, this.edgeMax);
                    return;
                }
                edge.value = "";
            });
            this.renderGraph();
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得指定最大、小值的隨機整數
     * @param {int} min 
     * @param {int} max 
     * @returns {int}
     * @see https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
     */
    getRandomNum(min, max)
    {
        try
        {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得擲硬幣結果
     * @param {int} percentage 
     * @returns {bool} 正或反
     */
    flipCoin(percentage)
    {
        try
        {
            if (percentage >= (Math.random() * 100))
            {
                return true;
            }
            return false;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    setEdgeInputs(edgesArray)
    {
        try
        {
            let numOfNode = edgesArray.length;
    
            if (!this.isValidNumOfNode(numOfNode)) return;
    
            this.numOfNode = numOfNode;
    
            configStorage.setNumOfNode(numOfNode);
    
            this.updateAdjcTable(this.numOfNode);
    
            this.edgeInputs = document.querySelectorAll(".adjacency-edge-input");
    
            for (let edgeInput of this.edgeInputs)
            {
                let row = parseInt(edgeInput.getAttribute("from-node"));
                let col = parseInt(edgeInput.getAttribute("to-node"));
    
                edgeInput.value = edgesArray[row][col];
            };
            this.renderGraph();
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 重置鄰接矩陣輸入欄
     */
    resetEdgeInputs()
    {
        try
        {
            for (let edgeInput of this.edgeInputs)
            {
                edgeInput.value = ""
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 重置鄰接矩陣
     */
    resetEdges()
    {
        try
        {
            this.edges = [];
    
            for (let i = 0; i < this.numOfNode; i++)
            {
                this.edges[i] = [];
    
                for (let j = 0; j < this.numOfNode; j++)
                {
                    this.edges[i][j] = null;
                }
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得三位數字轉透明度
     * @param {int} value 
     * @returns {int} 透明度
     */
    getTransparacy(value)
    {
        try
        {
            return 1 - value * 0.0009;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    // ******************************************************************************
    //                                  演算法

    // ******************************************************************************
    // 戴克斯特拉最短路徑演算法

    /**
     * 戴克斯特拉最短路徑演算法
     * @param {int} start 
     * @param {int} end 
     * @returns {object} 演算法結果
     * @see https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n
     */
    dijkstra(start = pathInputStart.value, end = pathInputEnd.value)
    {
        try
        {
            let startNode = this.getValidNode(parseInt(start));
            let endNode   = this.getValidNode(parseInt(end));
            let data      = this.getPathDataDefault([startNode, endNode]);
            let unvisited = Array.from( Array(this.numOfNode).keys()); // 未造訪陣列
    
            data.algorithm = "dijkstra";
    
            if (startNode == endNode)
            {
                return data;
            }
            let shortest = Array(this.numOfNode).fill(Number.MAX_SAFE_INTEGER); // 各節點距起點最近距離
            let source   = []; // 源頭陣列
    
            shortest[startNode] = 0;

            let safeloop = 50;
    
            while (unvisited.length)
            {
                if (!--safeloop)
                {
                    console.log("oops");
                    console.log(`${unvisited}`);
                    break;
                }

                let node = this.getNearestNodeToStart(unvisited, shortest); // 取得距起點最近且尚未造訪之節點，以下稱「目前節點」
    
                if (node == undefined) break;
    
                this.markAsVisited(node, unvisited); // 從未造訪陣列中取出目前節點

                for (let neighbor of unvisited)
                {
                    if (this.edges[node][neighbor] == null) continue; // 若查無邊則跳過
    
                    let edge        = this.edges[node][neighbor];
                    let oldShortest = shortest[neighbor];
                    let newShortest = shortest[node] + edge;
    
                    if (source[neighbor] != undefined && newShortest >= oldShortest) continue; // 若鄰居離起點的距離非前所未有地近則跳過
    
                    source[neighbor]   = node;
                    shortest[neighbor] = newShortest;
                }
            }
            let [path, distance] = this.retraceSource(endNode, source);
    
            if (path.length <= 1) // 若查無路徑則跳出
            {
                return data;
            }
            data.path     = path;
            data.edges    = this.getEdgesFromPath(path);
            data.distance = distance;
    
            this.setDijkstraCache(startNode, endNode, data); // 將最短路徑寫入快取
    
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得距起點最近且尚未造訪之節點
     * @param {array} unvisited 
     * @param {array} shortest 
     * @returns {int} 距起點最近且尚未造訪之節點代碼
     */
    getNearestNodeToStart(unvisited, shortest)
    {
        try
        {
            let min = Number.MAX_SAFE_INTEGER;
            let nearestNode;

            for (let node of unvisited)
            {
                if (shortest[node] >= min) continue;

                min = shortest[node];
                nearestNode = node;
            };
            return nearestNode;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 戴克斯特拉路徑朔源
     * @param {int} endNodeId 
     * @param {int} source 
     * @returns {array} 路徑及距離
     */
    retraceSource(endNodeId, source)
    {
        try
        {
            let path = []; // 路徑
            let nodeId = endNodeId;
            let totalDistance = 0;
    
            while (nodeId != undefined) // 回朔「源頭」以查詢路徑
            {
                if (this.edges[source[nodeId]] != undefined && this.edges[source[nodeId]][nodeId] != undefined)
                {
                    totalDistance += this.edges[source[nodeId]][nodeId];
                }
                path.unshift(nodeId);
    
                nodeId = source[nodeId];
            }
            return [path, totalDistance];
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * ******************************************************************************
     * 圖遍歷演算法
     * @returns {object}
     */
    tsp()
    {
        try
        {
            let algorithm1 = this.tspShortest("tspHybrid");
            let algorithm2 = this.tspShortest("tspNn");
    
            let betterTsp = this.tspStats.getBetterTspResult(algorithm1, algorithm2, this.numOfNode, this.edgeDensity);
    
            return betterTsp;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    runTspStats(numOfNode = 6, edgeDensity = 20, recordSize = 1000)
    {
        try
        {
            this.tspStats.isRunningStats = true;
    
            algorithmSlct.value        = "tsp";
            adjcConfigEdgeDensity.value = edgeDensity;
            this.edgeDensity            = edgeDensity;
    
            this.generateGraph(numOfNode);
    
            let loop = recordSize - 1;
    
            let interval = setInterval(() =>
            {
                if (!loop--)
                {
                    clearInterval(interval);

                    console.log(`${numOfNode}/${edgeDensity}`);
    
                    if (numOfNode +2 <= 18)
                    {
                        this.runTspStats(numOfNode +2, edgeDensity, recordSize);
                    }
                    else if (numOfNode == 18 && edgeDensity +10 <= 100)
                    {
                        this.runTspStats(6, edgeDensity +10, recordSize);
                    }
                    else // 統計結束
                    {
                        let matrix = this.tspStats.stats.matrix;
                        let hybridWinRatioMatrix = [];
                        let nnWinRatioMatrix     = [];

                        Object.keys(matrix).forEach( (numOfNode, i) =>
                        {
                            let row = matrix[numOfNode];

                            hybridWinRatioMatrix[i] = [];
                            nnWinRatioMatrix[i] = [];

                            Object.keys(row).forEach( (edgeDensity, j) =>
                            {
                                let stat = row[edgeDensity];

                                stat.total = recordSize;

                                hybridWinRatioMatrix[i][j] = stat.hybridWinRatio;
                                nnWinRatioMatrix[i][j]     = stat.nnWinRatio;
                            });
                        });
                        downloadAsJson("圖遍歷統計資料", JSON.stringify(matrix));
                        downloadAsJson("圖遍歷 - 混合演算法平均勝算統計", JSON.stringify(hybridWinRatioMatrix));
                        downloadAsJson("圖遍歷 - 最近距離搜索演算法平均勝算統計", JSON.stringify(nnWinRatioMatrix));
    
                        this.tspStats.isRunningStats = false;
                    }
                }
                else
                {
                    this.randomizeEdges();
                }
            }, 50);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得旅行商人演算法最優解
     * @returns {object}
     */
    tspShortest(algorithm)
    {
        try
        {
            let data = this.getPathDataDefault();
    
            data.algorithm = algorithm;
            data.separated = Array.from( Array(this.numOfNode).keys()); // 未造訪陣列
            data.distance = Number.MAX_SAFE_INTEGER;

            for (let nodeObj of this.nodes)
            {
                let startNode = nodeObj.id;
    
                let pathData = undefined;
    
                switch (algorithm)
                {
                    case "tspHybrid":
                        pathData = this.tspHybrid(startNode);
                        break;
                    case "tspNn":
                        pathData = this.tspNn(startNode);
                        break;
                }
                if (pathData == undefined)
                {
                    return data;
                }
                if (pathData.path.length <= 1) continue;

                if (pathData.separated.length >= data.separated.length) continue;

                if (pathData.distance >= data.distance) continue;
                
                data = pathData;

                while (false);
            };
            if (data.distance == Number.MAX_SAFE_INTEGER)
            {
                data.distance = 0;
            }
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * ******************************************************************************
     * 圖遍歷 - 混合演算法
     * @param {int} start 
     * @returns {object} 演算法結果
     */
    tspHybrid(start = 0)
    {
        try
        {
            let startNode = this.getValidNode(parseInt(start));
            let data      = this.getPathDataDefault();
            let unvisited = Array.from( Array(this.numOfNode).keys()); // 未造訪陣列
            let path      = [startNode];
    
            data.algorithm = "tspHybrid";
    
            while(unvisited.length)
            {
                let lastNode = path.pop();
    
                let mostPopulatedPath = this.getMostPopulatedPath(lastNode, unvisited);
    
                if (mostPopulatedPath == undefined || !mostPopulatedPath.length)
                {
                    path.push(lastNode);
                    break;
                }
                path.push(...mostPopulatedPath);

                for (let node of mostPopulatedPath)
                {
                    this.markAsVisited(node, unvisited);
                };
            }
            this.helpSeparatedNodes(unvisited, path); // 若有分離節點則嘗試拯救之
            this.connectPathEndToStart(path);         // 連結路徑首尾
    
            data.path      = path;
            data.separated = unvisited;
    
            if (path.length <= 1)
            {
                return data;
            }
            data.edges     = this.getEdgesFromPath(path);
            data.distance  = this.getDistanceFromPath(path);
    
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 於未造訪節點當中取得指定起點且所經未造訪節點最多之路徑
     * @param {int} node 
     * @returns {array}
     */
    getMostPopulatedPath(node, unvisited)
    {
        try
        {
            let uCountRecord = []; // 路徑中未造訪節點數的歷史紀錄，以下略稱 UCR
            let shortestDistance = Number.MAX_SAFE_INTEGER; // 路徑最短距離的歷史紀錄，以下略稱 SD

            for (let endNode of unvisited)
            {
                if (node == endNode) continue; // 若起訖節點同為一點則跳過

                let data = this.getDijkstraCache(node, endNode); // 取得起點至第 i 個節點的最短路徑
    
                if (data.path.length <= 1) continue; // 若查無路徑則跳過
    
                let uCount = this.getArrayOverlapCount(data.path, unvisited); // 取得路徑中未造訪節點數，以下略稱 UC

                if (uCount < uCountRecord.length) continue; // 若 UC < UCR 則跳過

                if (uCount == uCountRecord.length && data.distance >= shortestDistance) continue; // 若 UC = UCR 且路徑長度大於 SD 則跳過

                uCountRecord = Array.from(data.path); // 更新 UCR
            };
            return uCountRecord;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * ******************************************************************************
     * 圖遍歷 - 最近鄰居搜索
     * @param {int} start 
     * @returns {object} 演算法結果
     */
    tspNn(start = 0)
    {
        try
        {
            let startNode = this.getValidNode(parseInt(start));
            let data      = this.getPathDataDefault();
            let unvisited = Array.from( Array(this.numOfNode).keys()); // 未造訪陣列
            let path = [startNode];
    
            data.algorithm = "tspNn";
    
            this.markAsVisited(startNode, unvisited); // 從未造訪陣列中取出節點
    
            while(unvisited.length)
            {
                let endNode = path[path.length-1];
    
                let neighbor = this.getNearestNeighbor(unvisited, endNode); // 取得距目前節點最近的鄰居
    
                if (neighbor == -1) break; // 若已查無鄰居則跳出
    
                this.markAsVisited(neighbor, unvisited); // 從未造訪陣列中取出節點
    
                path.push(neighbor);
            }
            data.path      = path;
            data.separated = unvisited;
    
            if (path.length <= 1)
            {
                return data; // 若路徑不存在則跳出
            }
            this.helpSeparatedNodes(unvisited, path); // 若有分離節點則嘗試拯救之
            
            this.connectPathEndToStart(path);         // 連結路徑首尾
    
            data.path      = path;
            data.separated = unvisited;
    
            if (path.length <= 1)
            {
                return data;
            }
            data.edges     = this.getEdgesFromPath(path);
            data.distance  = this.getDistanceFromPath(path);
    
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得未造訪陣列裡指定節點的最近鄰居
     * @param {array} unvisited 
     * @param {int} node 
     * @returns {int}
     */
    getNearestNeighbor(unvisited, node)
    {
        try
        {
            let shortestEdge    = Number.MAX_SAFE_INTEGER;
            let nearestNeighbor = -1;

            for (let neighbor of unvisited)
            {
                if (this.edges[node][neighbor] == null || this.edges[node][neighbor] >= shortestEdge) continue;
    
                shortestEdge    = this.edges[node][neighbor];
                nearestNeighbor = neighbor;
            }
            return nearestNeighbor;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 拯救被分離的所有節點
     * @param {array} unvisited 
     * @param {array} path
     */
    helpSeparatedNodes(unvisited, path)
    {
        try
        {
            if (!unvisited.length) return;
    
            let maxLoop = unvisited.length * path.length; // 跑多次陣列以確保更多拯救的可能性
    
            while (unvisited.length && maxLoop--)
            {
                let separatedNode = unvisited.shift();
    
                let helpSucceed = this.helpSeparatedNode(path, separatedNode);
    
                if (helpSucceed) continue;
    
                unvisited.push(separatedNode);
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 拯救被分離的單個節點
     * @param {array} path 
     * @param {int} separatedNode
     * @returns {bool}
     */
    helpSeparatedNode(path, separatedNode)
    {
        try
        {
            let shortestEdge = Number.MAX_SAFE_INTEGER;
            let insertIndex  = -1;
            let pushNodes = [];
    
            for (let i = 0; i < path.length-1; i++)
            {
                let source   = path[i];
                let neighbor = path[i+1];
                let edgeFromSource = this.edges[source][separatedNode];
                let edgeToSource   = this.edges[separatedNode][source];
                let edgeToNeighbor = this.edges[separatedNode][neighbor];
    
                if (edgeFromSource == null || (edgeToSource == null && edgeToNeighbor == null)) continue; // 若邊全是 null 則跳出
    
                let edgeTo = this.getShorterEdge(edgeToSource, edgeToNeighbor);
    
                let edgeSum = edgeFromSource + edgeTo; // 取得「源頭 -> 節點 -> 鄰居」的總長度
    
                if (edgeSum >= shortestEdge) continue; // 若總長度非前所未有的短則跳出
    
                shortestEdge = edgeSum; // 更新最短總長度
    
                insertIndex = i+1;
    
                pushNodes = [separatedNode]; // 更新堆入的節點為「僅分離節點」
                
                if (edgeTo == edgeToSource) // 若鄰居即源頭則更新堆入的節點為「分離節點 + 源頭」
                {
                    pushNodes.push(source);
                }
            }
            if (insertIndex == -1)
            {
                return false;
            }
            path.splice(insertIndex, 0, ...pushNodes);
    
            this.removeDupedEndNode(path); // 移除拯救過程中可能出現的重複性隊尾
    
            return true;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得較小的邊
     * @param {int} edge1 
     * @param {int} edge2 
     * @returns {int}
     */
    getShorterEdge(edge1, edge2)
    {
        try
        {
            if (edge1 == null)
            {
                return edge2
            }
            if (edge2 == null)
            {
                return edge1;
            }
            return Math.min(edge1, edge2);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 移除陣列尾端多餘的節點
     * @param {array} path 
     */
    removeDupedEndNode(path)
    {
        try
        {
            while (true)
            {
                let endNode = path.pop(); // 取出最後一個值來檢查
    
                if (path.indexOf(endNode) != -1) continue; // 若陣列在取出最後一個值後查無同值則跳出
    
                path.push(endNode); // 否則將該值推回陣列，陣列尾端無多餘的節點
    
                break;
            }
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * ******************************************************************************
     * 最小生成樹 - 貪婪演算法
     * @returns {object}
     */
    mst()
    {
        try
        {
            let data         = this.getPathDataDefault();
            let tree         = [];                              // 最小生成樹
            let visited      = [];                              // 已造訪陣列
            let unvisited    = Array.from( Array(this.numOfNode).keys()); // 未造訪陣列
            let shortestEdge = this.getShortestEdgeFromGraph(); // 圖中最短邊
    
            data.algorithm = "mst";
            data.separated = unvisited;
    
            if (shortestEdge.fromNode == null)
            {
                return data;
            }
            let fromNode = shortestEdge.fromNode;
            let toNode   = shortestEdge.toNode;
    
            tree.push(shortestEdge);
    
            this.markAsVisited(fromNode, unvisited, visited);
            this.markAsVisited(toNode, unvisited, visited);
    
            while(unvisited.length)
            {
                let edge = this.getShortestEdgeFromGroups(visited, unvisited); // 取得未造訪陣列中最接近路徑的節點
    
                if (edge.fromNode == null)
                {
                    break;
                }
                tree.push(edge);
    
                this.markAsVisited(edge.toNode, unvisited, visited);
            }
            data.edges    = tree; // 格式一樣
            data.distance = this.getDistanceFromEdges(tree);
            data.separated = unvisited;
            
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    // ******************************************************************************
    //                                  演算法工具
    // ******************************************************************************

    /**
     * 連接路徑首尾
     * @param {array} path
     */
    connectPathEndToStart(path)
    {
        try
        {
            if (path.length < 2) return;
    
            let pathEndNode = path.pop(); // 取得路徑末項
    
            let pathToStartNode = this.getDijkstraCache(pathEndNode, path[0]); // 取得路徑末項至起點的最短距離
    
            if (pathToStartNode.path.length < 2)
            {
                path.push(pathEndNode);
                return;
            }
            path.push(...pathToStartNode.path); // 圖遍歷完成
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 將值移出未造訪陣列並推入已造訪陣列
     * @param {int} value
     * @param {array} unvisited
     * @param {array} visited
     */
    markAsVisited(value, unvisited, visited)
    {
        try
        {
            this.removeArrayItemByValue(unvisited, value);
    
            if (visited == undefined || visited.indexOf(value) != -1) return;
    
            visited.push(value);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 將指定值移出陣列
     * @param {array} array
     * @param {int} value
     */
    removeArrayItemByValue(array, value)
    {
        try
        {
            let index = array.indexOf(value);
    
            if (index == -1) return;
    
            array.splice(index, 1);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得圖中最短邊資料
     * @returns {object}
     */
    getShortestEdgeFromGraph()
    {
        try
        {
            let data = {
                fromNode: null,
                toNode: null,
                weight: Number.MAX_SAFE_INTEGER
            };
            this.edges.forEach( (edgeRow, i) =>
            {
                edgeRow.forEach( (edge, j) =>
                {
                    if (edge != null && edge < data.weight)
                    {
                        data.fromNode = i;
                        data.toNode   = j;
                        data.weight   = edge;
                    }
                });
            });
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得兩節點群組之間最短的邊資料
     * @param {array} visited
     * @param {array} unvisited
     * @returns {object}
     */
    getShortestEdgeFromGroups(nodeGroup1, nodeGroup2)
    {
        try
        {
            let data = {
                fromNode: null,
                toNode: null,
                weight: Number.MAX_SAFE_INTEGER
            };
            for (let fromNode of nodeGroup1)
            {
                for (let toNode of nodeGroup2)
                {
                    let edge = this.edges[fromNode][toNode];

                    if (edge == null) continue;
                    if (edge >= data.weight) continue;
    
                    data.fromNode = fromNode;
                    data.toNode   = toNode;
                    data.weight   = edge;
                }
            }
            return data;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 回傳有效的路徑參數
     * @param {int} node 
     * @returns {int}
     */
    getValidNode(node)
    {
        try
        {
            node = getNumberWithin(node, 0, this.numOfNode - 1);

            if (node == "")
            {
                node = 0;
            }
            return parseInt(node);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得預設路徑資料
     * @param {array} nodes
     * @returns {object}
     */
    getPathDataDefault(nodes = [])
    {
        try
        {
            return {
                nodes: nodes,
                path: [nodes[0]],
                edges: [],
                distance: 0,
                separated: [],
                algorithm: "none"
            };
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得指定陣列中有多少重複項目
     * @param {array} array1
     * @param {array} array2
     */
    getArrayOverlapCount(array1, array2)
    {
        try
        {
            let count = 0;

            for (let item of array1)
            {
                if (array2.indexOf(item) == -1) continue;
                
                count++;
            }
            return count;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 從路線中取出邊所組成的陣列
     * @param {array} path 
     * @returns {array}
     */
    getEdgesFromPath(path)
    {
        try
        {
            let edges = [];
            
            for (let i = 0; i < path.length -1; i++)
            {
                if (path[i+1] == undefined) break;
                
                edges[i] = {
                    fromNode: path[i],
                    toNode: path[i+1],
                    weight: this.edges[path[i]][path[i+1]]
                }
            }
            return edges;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得路徑長度
     * @param {array} path 
     * @returns {int}
     */
    getDistanceFromPath(path)
    {
        try
        {
            let distance = 0;
    
            for (let i = 0; i < path.length -1; i++)
            {
                distance += this.edges[path[i]][path[i+1]];
            }
            return distance;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 從邊資料中取的總距離
     * @param {array} edges 
     * @returns {int}
     */
    getDistanceFromEdges(edges)
    {
        try
        {
            let distance = 0;

            for (let edge of edges)
            {
                distance += edge.weight;
            }
            return distance;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 將最短路徑資料寫入快取
     * @param {int} startNode 
     * @param {int} endNode 
     * @param {array} path 
     */
    setDijkstraCache(startNode, endNode, path)
    {
        try
        {
            if (this.dijkstraCache[startNode] == undefined)
            {
                this.dijkstraCache[startNode] = [];
            }
            this.dijkstraCache[startNode][endNode] = path;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    /**
     * 取得指定起訖節點之最短路徑快取
     * @param {int} startNode 
     * @param {int} endNode 
     * @returns {array}
     */
    getDijkstraCache(startNode, endNode)
    {
        try
        {
            if (this.dijkstraCache[startNode] == undefined || this.dijkstraCache[startNode][endNode] == undefined)
            {
                return this.dijkstra(startNode, endNode);
            }
            return this.dijkstraCache[startNode][endNode];
        }
        catch (e)
        {
            console.log(e.message);
        }
    }
}