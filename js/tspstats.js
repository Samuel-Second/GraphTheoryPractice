/**
 * 圖遍歷統計器
 */
class TspStats
{
    stats;

    isRunningStats = false;

    constructor()
    {
        this.stats = {
            hybridWins: 0,
            hybridWinRatio: 0,
            nnWins: 0,
            nnWinRatio: 0,
            total: 0,
            matrix: {}
        }
    }

    getBetterTspResult(algorithmData1, algorithmData2, numOfNode, edgeSpread)
    {
        try
        {
            let distance1       = algorithmData1.distance;
            let nodeCount1      = algorithmData1.path.length;
            let separatedCount1 = algorithmData1.separated.length;
    
            let distance2       = algorithmData2.distance;
            let nodeCount2      = algorithmData2.path.length;
            let separatedCount2 = algorithmData2.separated.length;
    
            if (separatedCount1 == separatedCount2) // 若兩演算法的分離節點數一致
            {
                if (distance1 == distance2) // 若兩演算法的總距離一致
                {
                    if (nodeCount1 == nodeCount2) // 若兩演算法的行經節點數一致：完全平局
                    {
                        this.doneCompare(numOfNode, edgeSpread);
    
                        return algorithmData1; // 回傳演算法 1
                    }
                    if (nodeCount1 < nodeCount2) // 若前項的行經節點數較少
                    {
                        this.tspDijkstraWon(numOfNode, edgeSpread);
    
                        return algorithmData1; // 回傳演算法 1
                    }
                    this.tspNnWon(numOfNode, edgeSpread);
    
                    return algorithmData2; // 否則回傳演算法 2
                }
                if (distance1 < distance2) // 否則，若前項總距離較近
                {
                    this.tspDijkstraWon(numOfNode, edgeSpread);
    
                    return algorithmData1; // 回傳演算法 1
                }
                this.tspNnWon(numOfNode, edgeSpread);
    
                return algorithmData2; // 否則回傳演算法 2
            }
            if (separatedCount1 < separatedCount2) // 若前項的分離節點數較少
            {
                this.tspDijkstraWon(numOfNode, edgeSpread);
    
                return algorithmData1; // 回傳演算法 1
            }
            this.tspNnWon(numOfNode, edgeSpread);
    
            return algorithmData2; // 否則回傳演算法 2
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    tspDijkstraWon(numOfNode, edgeSpread)
    {
        try
        {
            this.setStats("dijkstra", numOfNode, edgeSpread);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    tspNnWon(numOfNode, edgeSpread)
    {
        try
        {
            this.setStats("nn", numOfNode, edgeSpread);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    doneCompare(numOfNode, edgeSpread)
    {
        try
        {
            this.setStats("draw", numOfNode, edgeSpread);
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    setStats(winner, numOfNode, edgeSpread)
    {
        try
        {
            if (!this.isRunningStats) return;

            this.stats.total++;

            if (this.stats.matrix[numOfNode] == undefined)
            {
                this.stats.matrix[numOfNode] = {};
            }
            if (this.stats.matrix[numOfNode][edgeSpread] == undefined)
            {
                this.stats.matrix[numOfNode][edgeSpread] = {
                    hybridWins: 0,
                    bybridWinRatio: 0,
                    nnWins: 0,
                    nnWinRatio: 0,
                    total: 0
                }
            }
            let matrixCell = this.stats.matrix[numOfNode][edgeSpread];

            if (winner == "dijkstra")
            {
                this.stats.hybridWins++;
                matrixCell.hybridWins++;
            }
            else if (winner == "nn")
            {
                this.stats.nnWins++;
                matrixCell.nnWins++;
            }
            this.stats.hybridWinRatio = this.getWinRatio(this.stats.hybridWins, this.stats.nnWins);

            matrixCell.bybridWinRatio = this.getWinRatio(matrixCell.hybridWins, matrixCell.nnWins);
            matrixCell.nnWinRatio       = this.getWinRatio(matrixCell.nnWins, matrixCell.hybridWins);
            matrixCell.total++;
        }
        catch (e)
        {
            console.log(e.message);
        }
    }

    getWinRatio(win1, win2)
    {
        try
        {
            if (win1 == 0)
            {
                return 0;
            }
            if (win2 == 0)
            {
                return "Infinity";
            }
            return parseFloat((win1 / win2).toFixed(4));
        }
        catch (e)
        {
            console.log(e.message);
        }
    }
}