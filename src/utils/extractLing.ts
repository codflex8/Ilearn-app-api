export function containsLink(message: string): boolean {
  const urlPattern = new RegExp(
    /((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}|(localhost)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d+)?(\/\S*)?/gi
  );
  return urlPattern.test(message);
}
