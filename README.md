# ShipStation Order Splitting

This app is a Node.js / Express.js that creates a simple API to receive a new order webhook from ShipStation.  Upon the receipt of a new order, this app will analyze the order to determine if it is necessary to split the order based on the invidual line item's warehouse location.  If a split is necsarry, the app will create new copies of the order in shipstation, one for each product's warehouse location.

For an introduction video and demo of this app, check out this video - 

https://www.youtube.com/watch?v=I-rpgSMXKuw&t=1s

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|SHIPSTATION_API_KEY           | Your base64 encoded ShipStation Username:Password          | N/A      |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/)


# Getting started
- Clone the repository
```
git clone https://github.com/AgenticAI/shipstation-order-splitting.git
```
- Install dependencies
```
cd shipstation-order-splitting/
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`

- API Document endpoints

  ShipStation New Order Webhook: Endpoint : http://localhost:3000/shipstation/new-order-webhook
  
  
