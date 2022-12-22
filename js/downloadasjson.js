/**
 * 下載文字檔
 * @param {string} filename 
 * @param {string} text 
 * @see https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
 */
function downloadAsJson(filename, text)
{
	var element = document.createElement('a');

	element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', `${filename}.json`);
	element.click();
}