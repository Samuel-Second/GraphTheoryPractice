/**
 * 刪除字串中非數字字元
 * @param {*} value 
 * @returns {int}
 * @see https://stackoverflow.com/questions/1862130/strip-all-non-numeric-characters-from-string-in-javascript 
 */
function getCleanDigits(value)
{
    try
    {
        let result = value.toString().replace(/\D/g,'');

        if (result == "")
        {
            return "";
        }
        return parseInt(result);
    }
    catch (e)
    {
        console.log(e.message);
    }
}