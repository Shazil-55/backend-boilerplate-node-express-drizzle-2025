import { URL_REGEX } from './contants';

export function validateUrl(url: string): string | null {
  // Regular expression for URL validation
  const urlRegex = URL_REGEX;

  // Check if the URL matches the regex and has 'https://' protocol
  if (urlRegex.test(url)) {
    // If the URL doesn't start with 'https://', add it
    if (!url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  } else {
    return null;
  }
}
