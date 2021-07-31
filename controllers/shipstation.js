const axios = require("axios");

exports.newOrders = async (req, res, next) => {
  try {
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
  } catch (err) {
    throw new Error(err);
  }
};

const analyzeOrders = async (newOrders) => {
  for (let x = 0; x < newOrders.length; x++) {
    try {
      const order = newOrders[x];

      const warehouses = [
        ...new Set(
          order.items.map((item) => {
            if (item.warehouseLocation) {
              return item.warehouseLocation;
            }
          })
        ),
      ];

      if (warehouses.length > 1) {
        const orderUpdateArray = splitShipstationOrder(order, warehouses);
        await shipstationApiCall(
          "https://ssapi.shipstation.com/orders/createorders",
          "post",
          orderUpdateArray
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }
};

const splitShipstationOrder = (order, warehouses) => {
  let orderUpdateArray = [];

  for (let x = 0; x < warehouses.length; x++) {
    try {
      let tempOrder = { ...order };
      tempOrder.orderNumber = `${tempOrder.orderNumber}-${warehouses[x]}`;

      console.log(`Creating order ${tempOrder.orderNumber}`);

      tempOrder.items = tempOrder.items.filter((item) => {
        // If the Item's warehouseLocation is null, assign it to the first warehouse
        if (!item.warehouseLocation && x === 0) {
          item.warehouseLocation = warehouses[x];
        }
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
    } catch (err) {
      throw new Error(err);
    }
  }

  return orderUpdateArray;
};

const shipstationApiCall = async (url, method, body) => {
  try {
    const config = {
      method: method || "get",
      url: url,
      headers: {
        Authorization: process.env.SHIPSTATION_API_KEY,
        "Content-Type": "application/json",
      },
    };

    if (body && method.toLowerCase() === "post") {
      config["data"] = JSON.stringify(body);
    }

    const response = await axios(config);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
