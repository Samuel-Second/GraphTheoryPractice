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
            let path1           = algorithmData1.path;
            let pathLength1     = algorithmData1.path.length;
            let distance1       = algorithmData1.distance;
            let separatedCount1 = algorithmData1.separated.length;
    
            let path2           = algorithmData2.path;
            let pathLength2     = algorithmData2.path.length;
            let distance2       = algorithmData2.distance;
            let separatedCount2 = algorithmData2.separated.length;

            // 誰遍歷圖較成功？
            if (path2[0] != path2[pathLength2-1] && path1[0] == path1[pathLength1-1]) // 演算法 1
            {
                this.tspDijkstraWon(numOfNode, edgeSpread);
                return algorithmData1;
            }
            if (path1[0] != path1[pathLength1-1] && path2[0] == path2[pathLength2-1]) // 演算法 2
            {
                this.tspNnWon(numOfNode, edgeSpread);
                return algorithmData2;
            }
            // 誰的分離節點數較少？
            if (separatedCount1 < separatedCount2) // 演算法 1
            {
                this.tspDijkstraWon(numOfNode, edgeSpread);
                return algorithmData1;
            }
            if (separatedCount1 > separatedCount2) // 演算法 2
            {
                this.tspNnWon(numOfNode, edgeSpread);
                return algorithmData2;
            }
            // 誰的總距離較近？
            if (distance1 < distance2) // 演算法 1
            {
                this.tspDijkstraWon(numOfNode, edgeSpread);

                return algorithmData1;
            }
            if (distance1 > distance2) // 演算法 2
            {
                this.tspNnWon(numOfNode, edgeSpread);
                return algorithmData2;
            }
            // 誰的行經節點數較少？
            if (pathLength1 < pathLength2) // 演算法 1
            {
                this.tspDijkstraWon(numOfNode, edgeSpread);
                return algorithmData1;
            }
            if (pathLength1 > pathLength2) // 演算法 2
            {
                this.tspNnWon(numOfNode, edgeSpread);
                return algorithmData2;
            }
            // 平手
            this.doneCompare(numOfNode, edgeSpread);
            return algorithmData1;
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