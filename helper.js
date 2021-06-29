// Filters the array of objects and return single object for every unique order_id and also returns all item in an array for that order
const formatArrayObject = function(arrObj) {
  const formattedArrObj = [];
  for (const obj of arrObj) {
    if (formattedArrObj[obj.id]) {
      formattedArrObj[obj.id].item_names.push(obj.item_name);
    } else {
      const rObj = obj;

      rObj.item_names = [obj.item_name];
      formattedArrObj[rObj.id] = rObj;
    }
  }

  return formattedArrObj.filter(ele => ele != null);

}

module.exports = formatArrayObject;
