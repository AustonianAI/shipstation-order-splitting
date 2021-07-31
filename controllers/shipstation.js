const axios = require("axios");

exports.newOrders = async (req, res, next) => {
  const url =
    req.body.resource_url ||
    "https://ssapi13.shipstation.com/orders?importBatch=6c4f2d15-7698-6113-4b90-d8cd13d32a24";

  const response = await shipstationApiCall(url);

  if (response.data.orders.length >= 1) {
    analyzeOrders(response.data.orders);
  }

  res.status(200).json({
    message: `Analyzed ${response.data.orders.length} new order(s).`,
    data: response.data.orders,
  });
};

const analyzeOrders = async (newOrders) => {
  for (let x = 0; x < newOrders.length; x++) {
    const order = newOrders[x];
    console.log(`Analyzing order ${order.orderId} - ${order.billTo.name}`);

    const warehouses = [
      ...new Set(
        order.items.map((item) => {
          return item.warehouseLocation;
        })
      ),
    ];

    if (warehouses.length > 1) {
      const orderUpdateArray = splitShipstationOrder(order, warehouses);
      const response = await shipstationApiCall(
        "https://ssapi.shipstation.com/orders/createorders",
        "post",
        orderUpdateArray
      );
    }
  }
};

const splitShipstationOrder = (order, warehouses) => {
  let orderUpdateArray = [];

  for (let x = 0; x < warehouses.length; x++) {
    let tempOrder = { ...order };
    tempOrder.orderNumber = `${tempOrder.orderNumber}-${warehouses[x]}`;

    console.log(`Creating order ${tempOrder.orderNumber}`);

    // ToDo: Handle an item with no warehouse location

    tempOrder.items = tempOrder.items.filter((item) => {
      return item.warehouseLocation === warehouses[x];
    });
    if (x !== 0) {
      delete tempOrder.orderKey;
      delete tempOrder.orderId;
      tempOrder.amountPaid = 0;
      tempOrder.taxAmount = 0;
      tempOrder.shippingAmopunt = 0;
    }
    orderUpdateArray.push(tempOrder);
  }

  return orderUpdateArray;
};

const shipstationApiCall = async (url, method, body) => {
  try {
    const config = {
      method: method || "get",
      url: url,
      headers: {
        Authorization:
          "Basic MjcyZmVkZTc5ZDRhNDUyOGIxYmI5M2IwMTNmNjY0ZTc6ODI4NGU2Y2QwZWUwNGZkMWIwYTA2MWZjMmM3OTc3ZTI=",
        "Content-Type": "application/json",
      },
    };

    if (body && method.toLowerCase() === "post") {
      config["data"] = JSON.stringify(body);
    }

    console.log(config);

    const response = await axios(config);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
