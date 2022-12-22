/**
 * 筆刷類別
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText
 */
class Brush
{
    canvasElm; // 畫布元素

    canvas; // 畫布內容

    canvasWidth;

    canvasHeight;

    lineWidth = 10; // 筆刷粗細

    circleRadius = 30; // 圓圈半徑

    textFont = "Microsoft JhengHei";

    textAlignRule = { // 代碼是根據數字鍵盤而定
        7: {
            horizontal: "right",
            vertical: "bottom"
        },
        8: {
            horizontal: "center",
            vertical: "bottom"
        },
        9: {
            horizontal: "left",
            vertical: "bottom"
        },
        4: {
            horizontal: "right",
            vertical: "middle"
        },
        5: {
            horizontal: "center",
            vertical: "middle"
        },
        6: {
            horizontal: "left",
            vertical: "middle"
        },
        1: {
            horizontal: "right",
            vertical: "top"
        },
        2: {
            horizontal: "center",
            vertical: "top"
        },
        3: {
            horizontal: "left",
            vertical: "top"
        },
    }

    /**
     * 初始化筆刷
     * @param {HTMLElement} canvasElm
     */
    constructor(canvasElm)
    {
        this.canvasElm    = canvasElm
        this.canvas       = canvasElm.getContext("2d");
        this.canvasWidth  = canvasElm.width;
        this.canvasHeight = canvasElm.height;

        this.setTextSize();
        
        this.resetTextAlign();
    }

    setTextSize(size = 30)
    {
        this.canvas.font = `${size}px ${this.textFont}`;
    }

    resetTextAlign()
    {
        this.setTextAlign(5);
    }

    setTextAlign(alignCode)
    {
        let rule = this.textAlignRule[alignCode];

        this.canvas.textAlign    = rule.horizontal;
        this.canvas.textBaseline = rule.vertical;
    }

    /**
     * 設定線條樣式
     * @param {string} color 
     * @param {int} width 
     */
    setLineStyle(color = "black", width = 1)
    {
        this.canvas.strokeStyle = color;
        this.canvas.lineWidth   = width;
    }

    /**
     * 重置線條樣式
     */
    resetLineStyle()
    {
        this.setLineStyle();
    }

    /**
     * 繪製線條
     * @param {float} x1 
     * @param {float} y1 
     * @param {float} x2 
     * @param {float} y2 
     * @param {string} color
     * @param {int} width
     */
    drawLine(x1, y1, x2, y2, color, width)
    {
        this.setLineStyle(color, width);

        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        this.canvas.stroke();

        this.resetLineStyle();
    }

    /**
     * 繪製圓圈
     * @param {float} x 
     * @param {float} y
     * @param {string} color
     * @param {int} width
     */
    drawCircle(x, y, color = "black", width = 1)
    {
        this.setLineStyle(color, width);

        this.canvas.beginPath();
        this.canvas.arc(x, y, this.circleRadius, 0, 2 * Math.PI);
        this.canvas.stroke();

        this.resetLineStyle();
    }

    /**
     * 繪製文字
     * @param {float} x 
     * @param {float} y 
     * @param {string} text 
     */
    drawText(x, y, text)
    {
        this.canvas.fillText(text, x, y);
    }

    /**
     * 繪製指定座標且不會侵入圓圈內的箭頭
     * @param {float} x1 
     * @param {float} y1 
     * @param {float} x2 
     * @param {float} y2
     */
    drawArrow(x1, y1, x2, y2, color = "black", width = 1)
    {
        // 取得角度
        let theta1 = this.getTheta(x1, y1, x2, y2);
        let theta2 = this.getTheta(x2, y2, x1, y1);

        // 取得線條起終點
        let point1 = this.getCircleEdge(x1, y1, theta1, this.circleRadius);
        let point2 = this.getCircleEdge(x2, y2, theta2, this.circleRadius);
        
        // 畫線
        this.drawLine(point1.x, point1.y, point2.x, point2.y, color, width);

        // 取得終點的角度 ± 0.5 度
        let wingTheta1 = theta2 + 0.5;
        let wingTheta2 = theta2 - 0.5;

        // 取得箭頭線條兩終點
        let point3 = this.getCircleEdge(point2.x, point2.y, wingTheta1, 20);
        let point4 = this.getCircleEdge(point2.x, point2.y, wingTheta2, 20);

        // 畫出箭頭的翅膀
        this.drawLine(point2.x, point2.y, point3.x, point3.y, color, width);
        this.drawLine(point2.x, point2.y, point4.x, point4.y, color, width);
    }

    drawRect(x1, y1, x2, y2, color = "black")
    {
        this.setLineStyle(color, 0);
        this.canvas.fillStyle = color

        this.canvas.beginPath();
        this.canvas.rect(x1, y1, x2, y2);
        this.canvas.fill();

        this.canvas.fillStyle = "black";
        this.resetLineStyle();
    }

    /**
     * 取得指定座標之間的弧度
     * @param {float} x1 
     * @param {float} y1 
     * @param {float} x2 
     * @param {float} y2 
     * @returns {float} 弧度
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
     */
    getTheta(x1, y1, x2, y2)
    {
        let dy = y2 - y1;
        let dx = x2 - x1;
        let theta = Math.atan2(dy, dx);
        return theta;
    }

    /**
     * 取得圓周上一點的座標
     * @param {float} x 
     * @param {float} y 
     * @param {float} theta
     * @param {float} w
     * @returns {object} 邊的座標
     * @see https://www.mathsisfun.com/geometry/images/unit-circle-sin-cos-tan.svg
     */
    getCircleEdge(x, y, theta, w)
    {
        return {
            x: x + Math.cos(theta) * w,
            y: y + Math.sin(theta) * w,
        }
    }

    fillCanvas()
    {
        this.drawRect(0, 0, this.canvasWidth, this.canvasHeight, "#dde2ea");
    }

    /**
     * 清空畫布
     */
    clearCanvas()
    {
        this.canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.fillCanvas();
    }
}