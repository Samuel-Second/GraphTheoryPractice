/**
 * 元素轉圖片（回呼）
 * @see https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
 * @see https://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas
 * @see https://html2canvas.hertzen.com/configuration
 * @see https://stackoverflow.com/questions/71881661/html2canvas-black-background-after-background-color-is-specified
 */
function getImgByElm(element, scale, callBack)
{
    options = { // 設定元素轉圖片的參數
        scale: scale,
        backgroundColor: null,
        logging: false
    };
    html2canvas(element, options).then( (elementCanvas) =>
    {
        let img = document.createElement("img");
        img.src    = elementCanvas.toDataURL("image/png");
        img.onload = () => callBack(img);
    });
}