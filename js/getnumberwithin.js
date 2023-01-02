function getNumberWithin(value, min, max)
{
    try
    {
        value = getCleanDigits(value);
        
        if(value < min)
        {
            return min;
        }
        if (value > max)
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