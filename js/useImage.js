import { URL_IMG_SERVICE_PREFIX } from './config.js'

const DEFAULT_OPTIONS = {
  width: 50,
  height: 50,
  rounded: true,
  imagify: false,
  cache: true,
  mimetype: 'png'
}

export default async function useImage(imageOrigin, options = DEFAULT_OPTIONS) {
  try {
    let url = URL_IMG_SERVICE_PREFIX + encodeURIComponent(imageOrigin);
    for (var opt in options) {
      url += `&${opt}=${options[opt]}`;
    }
    const res = await axios.get(url);
    return res?.data?.url;
  } catch (error) {
    console.log("[ERR] useImage", error);
    return null;
  }
}
