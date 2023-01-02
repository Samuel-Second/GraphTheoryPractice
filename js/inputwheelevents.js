function inputWheelEvent(event)
{
    try
    {
        event.preventDefault();
                
        let value = getCleanDigits(event.target.value);

        if (event.deltaY < 0) // 往上
        {
            value++;
        }
        else if (event.deltaY > 0) // 往下
        {
            value--;
        }
        event.target.value = getNumberWithin(value, 0, 999);
    }
    catch (e)
    {
        console.log(e.message);
    }
}