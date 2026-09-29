export async function apiExists(url) {
  const response = await fetch(url, {
    method: "HEAD"
  });

  if (response.ok) {
    return true;
  } else {
    return false;
  }
}
