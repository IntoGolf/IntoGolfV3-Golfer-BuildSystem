async function calculateSignature(toSignStr, secretKey) {
  const encoder = new TextEncoder();
  const keyData = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    keyData,
    encoder.encode(toSignStr)
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function toSign(
  actionCode,
  appApiKey,
  apiVersion,
  sigVersion,
  sigMethod,
  timestampStr,
  responseFormat
) {
  return `${actionCode}/${appApiKey}/${apiVersion}/${sigVersion}/${sigMethod}/${timestampStr}/${responseFormat}`;
}

export { calculateSignature, toSign };
