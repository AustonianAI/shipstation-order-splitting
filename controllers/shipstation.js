const axios = require("axios");

/**
 * Receives and processes a new order webhook from ShipStation.
 */
exports.newOrders = async (req, res, next) => {
  try {
    // Retrieve the URL from the ShipStation webhook.
    const url = req.body.resource_url;

    // Pull the new orders
    const response = await shipstationApiCall(url);

    // If there are new orders, analyze the new orders.
    if (response.data.orders.length >= 1) {
      analyzeOrders(response.data.orders);
    }

    // Reply to the REST API request that new orders have been analyzed.
    res.status(200).json({
      message: `Analyzed ${response.data.orders.length} new order(s).`,
      data: response.data.orders,
    });
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Analyzs a new order from ShipStation to determine if a split is necessary.
 *
 * @param  {array} newOrders an array of order objects from ShipStation
 */
const analyzeOrders = async (newOrders) => {
  // Loop through each new order.
  for (let x = 0; x < newOrders.length; x++) {
    try {
      const order = newOrders[x];

      // Create an array of all the individual warehouseLocations present on the order.
      const warehouses = [
        ...new Set(
          order.items.map((item) => {
            if (item.warehouseLocation != null) {
              return item.warehouseLocation;
            }
          })
        ),
      ];

      // If there are multiple warehouse locations, split the order.
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

/**
 * Copies the primary order for each new order, adjusting the items on each to correspond
 * to the correct warehouse location.
 *
 * @param  {object} order an order object from the ShipStation API
 * @param {array} warehouses an array of strings containing the warehouse names
 *
 * @return {array} an array of order objects to be updated in ShipStation
 */
const splitShipstationOrder = (order, warehouses) => {
  let orderUpdateArray = [];

  // Loop through every warehouse present on the order.
  for (let x = 0; x < warehouses.length; x++) {
    try {
      // Create a copy of the original order object.
      let tempOrder = { ...order };

      // Give the new order a number to include the warehouse as a suffix.
      tempOrder.orderNumber = `${tempOrder.orderNumber}-${warehouses[x]}`;

      // Filter for the order items for this specific warehouse.
      tempOrder.items = tempOrder.items.filter((item) => {
        // If the item's warehouseLocation is null, assign it to the first warehouse present.
        if (item.warehouseLocation == null && x === 0) {
          item.warehouseLocation = warehouses[x];
        }
        return item.warehouseLocation === warehouses[x];
      });

      // If this is not the first (primary) order, set the object to create new order in ShipStation.
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

/**
 * Performs a ShipStation API Call
 *
 * @param {string} url the full URL to call from ShipStation
 * @param {string} method generally "get" or "post"
 * @param {JSON} body the body of a POST request (if applicable)
 *
 * @return {JSON} the response from the API call
 */
const shipstationApiCall = async (url, method, body) => {
  try {
    const config = {
      method: method || "get",
      url: url,
      headers: {
        // Your API Authorization token goes here.
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
