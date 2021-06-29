// Filters the array of objects and return single object for every unique order_id
const formatArrayObject = function(rowArr) {
  const filteredArr = (rowArr).map(obj => {
    let rObj = {}
    rObj.id = obj.id;
    rObj.created_at = obj.created_at;
    rObj.completed_at = obj.completed_at;
    rObj.user_id = obj.user_id;
    rObj.order_status = obj.order_status;
    rObj.item_name = (rowArr).map(a => {
      if (a.id === obj.id)
        return a.item_name;
    });

    return rObj
  })

  const data = filteredArr.reduce((acc, current) => {
    const x = acc.find(order => order.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  console.log('Items:', filteredArr);

  return data;
}

module.exports = formatArrayObject;
