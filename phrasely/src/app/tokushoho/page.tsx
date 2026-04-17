import Link from "next/link";

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-[var(--muted)] hover:text-[var(--accent)] transition text-sm mb-8 inline-block"
        >
          ← {"\u30DB\u30FC\u30E0\u306B\u623B\u308B"}
        </Link>

        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          {"\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5\u306B\u57FA\u3065\u304F\u8868\u8A18"}
        </h1>

        <div className="prose prose-invert max-w-none text-[var(--muted)]">
          <p className="mb-8">
            {
              "\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5\u7B2C11\u6761\u306B\u57FA\u3065\u304D\u3001\u4EE5\u4E0B\u306E\u901A\u308A\u8868\u793A\u3044\u305F\u3057\u307E\u3059\u3002"
            }
          </p>

          <table className="w-full border-collapse">
            <tbody>
              <Row
                label={"\u8CA9\u58F2\u696D\u8005\u306E\u540D\u79F0"}
                value="Kyren"
              />
              <Row
                label={"\u904B\u55B6\u8CAC\u4EFB\u8005"}
                value="Masato Naito"
              />
              <Row
                label={"\u6240\u5728\u5730"}
                value={
                  "\u8ACB\u6C42\u3092\u3044\u305F\u3060\u304D\u6B21\u7B2C\u3001\u9045\u6EDE\u306A\u304F\u958B\u793A\u3057\u307E\u3059"
                }
                note={
                  "(Will be disclosed upon request without delay)"
                }
              />
              <Row
                label={"\u9023\u7D61\u5148"}
                value={
                  <a
                    href="mailto:hey@kyren.app"
                    className="text-[var(--accent)] hover:underline"
                  >
                    hey@kyren.app
                  </a>
                }
              />
              <Row
                label={"\u96FB\u8A71\u756A\u53F7"}
                value={
                  "\u8ACB\u6C42\u3092\u3044\u305F\u3060\u304D\u6B21\u7B2C\u3001\u9045\u6EDE\u306A\u304F\u958B\u793A\u3057\u307E\u3059"
                }
                note={
                  "(Will be disclosed upon request without delay)"
                }
              />
              <Row
                label={"\u8CA9\u58F2\u4FA1\u683C"}
                value={
                  <>
                    {"Phrasely Pro: US$4.99 / "}
                    {"\u6708"}
                    <br />
                    {
                      "\u307E\u305F\u306F\u5E74\u984D\u6255\u3044 US$47.88\uFF08\u6708\u308A\u63DB\u7B97 US$3.99\uFF09"
                    }
                    <br />
                    <span className="text-sm">
                      {
                        "\u203B \u65E5\u672C\u5186\u6255\u3044\u306F Stripe \u306B\u3088\u308A\u81EA\u52D5\u63DB\u7B97\u3055\u308C\u307E\u3059\u3002\u6C7A\u6E08\u6642\u306B\u30EC\u30FC\u30C8\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002"
                      }
                    </span>
                  </>
                }
              />
              <Row
                label={
                  "\u5546\u54C1\u4EE3\u91D1\u4EE5\u5916\u306E\u5FC5\u8981\u6599\u91D1"
                }
                value={
                  "\u6D88\u8CBB\u7A0E\u304A\u3088\u3073\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u63A5\u7D9A\u6599\uFF08\u304A\u5BA2\u69D8\u8CA0\u62C5\uFF09"
                }
              />
              <Row
                label={"\u304A\u652F\u6255\u3044\u65B9\u6CD5"}
                value={
                  "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\uFF08Stripe \u6C7A\u6E08\uFF09\u2014 Visa / Mastercard / American Express / JCB \u307B\u304B"
                }
              />
              <Row
                label={"\u304A\u652F\u6255\u3044\u6642\u671F"}
                value={
                  "\u521D\u56DE\uFF1A\u304A\u7533\u3057\u8FBC\u307F\u6642\u306B\u6C7A\u6E08\u3055\u308C\u307E\u3059\u3002\u7D9A\u304D\uFF1A\u6BCE\u6708\u540C\u65E5\u306B\u81EA\u52D5\u66F4\u65B0\u30FB\u8AB2\u91D1\u3055\u308C\u307E\u3059\u3002"
                }
              />
              <Row
                label={
                  "\u30B5\u30FC\u30D3\u30B9\u306E\u63D0\u4F9B\u6642\u671F"
                }
                value={
                  "\u6C7A\u6E08\u5B8C\u4E86\u76F4\u5F8C\u3088\u308A\u3054\u5229\u7528\u3044\u305F\u3060\u3051\u307E\u3059\u3002"
                }
              />
              <Row
                label={
                  "\u30AD\u30E3\u30F3\u30BB\u30EB\u30FB\u89E3\u7D04"
                }
                value={
                  <>
                    {
                      "\u3044\u3064\u3067\u3082\u30AD\u30E3\u30F3\u30BB\u30EB\u53EF\u80FD\u3002\u30AD\u30E3\u30F3\u30BB\u30EB\u306F\u73FE\u5728\u306E\u8AB2\u91D1\u671F\u9593\u306E\u7D42\u4E86\u6642\u306B\u9069\u7528\u3055\u308C\u3001\u305D\u308C\u307E\u3067\u306F Pro \u6A5F\u80FD\u3092\u3054\u5229\u7528\u3044\u305F\u3060\u3051\u307E\u3059\u3002"
                    }
                    <br />
                    {
                      "\u30AD\u30E3\u30F3\u30BB\u30EB\u3054\u5E0C\u671B\u306E\u969B\u306F\u3001\u3054\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u6DFB\u3048\u3066 "
                    }
                    <a
                      href="mailto:hey@kyren.app"
                      className="text-[var(--accent)] hover:underline"
                    >
                      hey@kyren.app
                    </a>
                    {" \u307E\u3067\u3054\u9023\u7D61\u304F\u3060\u3055\u3044\u3002"}
                  </>
                }
              />
              <Row
                label={
                  "\u8FD4\u54C1\u30FB\u8FD4\u91D1\u30DD\u30EA\u30B7\u30FC"
                }
                value={
                  "\u30C7\u30B8\u30BF\u30EB\u30B5\u30FC\u30D3\u30B9\u306E\u6027\u8CEA\u4E0A\u3001\u539F\u5247\u3068\u3057\u3066\u8FD4\u91D1\u306F\u3044\u305F\u3057\u307E\u305B\u3093\u3002\u305F\u3060\u3057\u3001\u8AB2\u91D1\u30A8\u30E9\u30FC\u307E\u305F\u306F\u9577\u671F\u7684\u306A\u30B5\u30FC\u30D3\u30B9\u969C\u5BB3\u304C\u767A\u751F\u3057\u305F\u5834\u5408\u306F\u500B\u5225\u306B\u5BFE\u5FDC\u3044\u305F\u3057\u307E\u3059\u3002"
                }
              />
              <Row
                label={"\u52D5\u4F5C\u74B0\u5883"}
                value={
                  "\u30E2\u30C0\u30F3\u30D6\u30E9\u30A6\u30B6\uFF08Chrome\u3001Safari\u3001Firefox \u306E\u6700\u65B0\u7248\u3092\u63A8\u5968\uFF09\u304A\u3088\u3073\u30A4\u30F3\u30BF\u30FC\u30CD\u30C3\u30C8\u63A5\u7D9A"
                }
              />
            </tbody>
          </table>

          <div className="mt-8 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
            <p className="text-sm">
              {
                "\u3053\u306E\u30DA\u30FC\u30B8\u306F\u65E5\u672C\u306E\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5\u306B\u57FA\u3065\u304F\u8868\u793A\u3067\u3059\u3002\u3053\u308C\u4EE5\u5916\u306E\u5229\u7528\u6761\u4EF6\u306F "
              }
              <Link
                href="/terms"
                className="text-[var(--accent)] hover:underline"
              >
                Terms of Service
              </Link>
              {" \u304A\u3088\u3073 "}
              <Link
                href="/privacy"
                className="text-[var(--accent)] hover:underline"
              >
                Privacy Policy
              </Link>
              {" \u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  note,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
}) {
  return (
    <tr className="border-b border-[var(--border)]">
      <th className="text-left align-top py-4 pr-4 w-1/3 text-[var(--foreground)] font-semibold text-sm">
        {label}
      </th>
      <td className="py-4 text-sm">
        {value}
        {note && (
          <div className="text-xs text-[var(--muted)]/70 mt-1">{note}</div>
        )}
      </td>
    </tr>
  );
}
