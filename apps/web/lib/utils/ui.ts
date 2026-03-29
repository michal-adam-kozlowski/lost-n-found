export function pluralizePl(number: number, one: string, few: string, many: string) {
  const rules = new Intl.PluralRules("pl-PL");
  const rule = rules.select(number);
  switch (rule) {
    case "one":
      return one;
    case "few":
      return few;
    default:
      return many;
  }
}
