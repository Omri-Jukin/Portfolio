export async function getDictionary(locale: string, messages: any) {
  const dictionary = await import(`@/locales/${locale}.json`);
  console.log(dictionary);
  return {
    ...dictionary.default,
    ...messages,
  };
}