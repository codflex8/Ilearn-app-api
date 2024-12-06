const os = require("os");

export function getServerIPAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      // Find the IPv4 address that is not internal (not localhost)
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // Server's public IP address
      }
    }
  }

  return "127.0.0.1"; // Fallback to localhost if no public IP is found
}
