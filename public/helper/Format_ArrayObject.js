// Filters the array of objects and return single object for every unique order_id and also returns all item in an array for that order
const formatArrayObject = function(arrObj) {
  const formattedArrObj = [];
  for (const obj of arrObj) {
    //Checking if object at that index(i.e obj.id) is present, so this helps in creating only one object in array of objects for any order
    if (formattedArrObj[obj.id]) {
      //Push the item name in object's item_names array
      formattedArrObj[obj.id].item_names.push(obj.item_name);
    } else {
      //Creating new object.
      const rObj = obj;
      //Creating item_names array to hold all the items of respective order
      rObj.item_names = [obj.item_name];
      //Assigning newly created object to Array of objects at specified index(i.e rObj.id)
      formattedArrObj[rObj.id] = rObj;
    }
  }

  //removing the null entries from the object of array's.
  return formattedArrObj.filter(ele => ele != null);
}

module.exports = formatArrayObject;
