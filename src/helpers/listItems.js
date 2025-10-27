export function ingredientObject(string) {
  const ar = string.split("|").map((el) => el.trim());
  const name = ar[0][0].toUpperCase() + ar[0].substring(1).toLowerCase();
  const ingrObj = {
    name,
    quantity: ar[1] ? parseFloat(ar[1].match(/^\d+(\.\d+)?/)[0]) : 0,
    unit: ar[1] ? ar[1].match(/[a-zA-Z]+$/)[0] : "",
  };
  return ingrObj;
}

export function strListToObjList(list) {
  if (typeof list[0] === Object) return;

  return list.map((e) => {
    return ingredientObject(e);
  });
}

export const addItemToList = (item, list, setter) => {
  const itemObj = ingredientObject(item);
  const foundItem = list.filter((el) => {
    return Object.keys(el)[0] === itemObj.name;
  })[0];

  //do we have this item already?
  if (foundItem) {
    const quanUnitArray = Object.values(foundItem)[0]
      .split("+")
      .map((e) => e.trim());
    let doExist = false;

    //looking for a proper unit
    quanUnitArray.forEach((quanUnit, ind) => {
      const quant = parseFloat(quanUnit.trim().match(/^\d+(\.\d+)?/)[0]);
      const unit = quant === 0 ? "" : quanUnit.trim().match(/[a-zA-Z]+$/)[0];
      if (unit === itemObj.unit) {
        doExist = true;
        quanUnitArray[ind] = `${quant + itemObj.quantity}${unit}`;
      }
    });
    if (!doExist) {
      quanUnitArray.push(`${itemObj.quantity}${itemObj.unit}`);
    }
    foundItem[itemObj.name] = quanUnitArray.join(" + ");
    //setter(list => [...list, ]);
  } else {
    //console.log("item not found in list");
    const newItem = {};
    newItem[itemObj.name] = `${itemObj.quantity}${itemObj.unit}`;
    //totalIngredients.push(newIngredient);
    //setter([...list, newItem]);
    list.push(newItem);
    //setter((list) => [...list, newItem]);
  }
  //refreshShoppingList
};

const objToStr = (obj) => {
  const strItem = `${Object.keys(obj)[0]}${
    Object.values(obj)[0] == 0 ? "" : " | " + Object.values(obj)[0]
  }`;
  return strItem;
};

export const addToTotalShoppingList = (item, list, setter) => {
  const itemObj = ingredientObject(item);

  const objList = strListToObjList(list);

  const foundItem = objList.filter((el) => {
    return Object.keys(el)[0] === itemObj.name;
  })[0];

  //do we have this item already?
  if (foundItem) {
    const quanUnitArray = Object.values(foundItem)[0]
      .split("+")
      .map((e) => e.trim());
    let doExist = false;

    //looking for a proper unit
    quanUnitArray.forEach((quanUnit, ind) => {
      const quant = parseFloat(quanUnit.trim().match(/^\d+(\.\d+)?/)[0]);
      const unit = quant === 0 ? "" : quanUnit.trim().match(/[a-zA-Z]+$/)[0];
      if (unit === itemObj.unit) {
        doExist = true;
        quanUnitArray[ind] = `${quant + itemObj.quantity}${unit}`;
      }
    });
    if (!doExist) {
      quanUnitArray.push(`${itemObj.quantity}${itemObj.unit}`);
    }
    foundItem[itemObj.name] = quanUnitArray.join(" + ");
    //setter(list => [...list, ]);
    setter(
      objList.map((e) => {
        return objToStr(e);
      })
    );
  } else {
    const newItem = {};
    newItem[itemObj.name] = `${itemObj.quantity}${itemObj.unit}`;
    //totalIngredients.push(newIngredient);
    //setter([...list, newItem]);
    //list.push(newItem);
    setter((list) => [...list, objToStr(newItem)]);
  }
};
