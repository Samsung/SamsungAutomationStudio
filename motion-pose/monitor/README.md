# monitor

A node for monitoring the pose/hand recognition screen in an external browser.

## Usage

You can check the screen being detected in the external environment through the pose/hand-detect-node.

Apply the `Server Url` and `Monitor Port` of the pose/hand-detect-node to the properties of this node.

## Properties

### Server Url

URL address of your websocket server for monitoring. Do not include a prefix such as 'http://'. This is an attribute input item to facilitate both local and deployment environments. (default: 'localhost')

### Monitor Port

Port number to be used to monitor pose recognition results from other resources. (default: 1881)

