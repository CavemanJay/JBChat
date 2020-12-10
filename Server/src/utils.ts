export function unitTesting() {
  return process.env.UT === "true";
}

export function log(message?: any, ...optionalParams: any[]) {
  if (!unitTesting()) console.log(message, ...optionalParams);
}
