export function connectToDatabase(url) {
  if (!url) {
    throw new Error("Database URL is required");
  }
  if (url === "test") {
    return { status: "connected", test: true };
  }
  return { status: "connected", test: false };
}
