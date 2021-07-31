# ShipStation Order Splitting

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|SHIPSTATION_API_KEY           | Your base64 encodes ShipStation Username:Password          | N/A      |


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/)


# Getting started
- Clone the repository
```
git clone https://github.com/AgenticAI/shipstation-order-splitting.git
```
- Install dependencies
```
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`

- API Document endpoints

  ShipStation New Order Webhook: Endpoint : http://localhost:3000/shipstation/new-order-webhook
