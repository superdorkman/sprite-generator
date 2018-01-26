const filter = {
  goodsType: '',
  tradeType: '',
  areaName: '',
  serverName: '',
  orderBy: '',
  unitPrice: null,
  sellerValid: null,
  imgValid: null,
  scale1: null,
  scale2: null,
  search: '',
}

const params = { 
  goodsType: "游戏账号", 
  scale1: "狂战士", 
  scale2: "男" 
};

var o3 = Object.assign(filter, params);
var o4 = Object.assign({}, filter, params);

console.log('o3', o3);
console.log('o4', o4);