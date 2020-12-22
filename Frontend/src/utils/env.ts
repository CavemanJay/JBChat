const PREFIX = "REACT_APP_";

export function getEnvironmentKey(key: string) {
  return process.env[PREFIX + key];
}
