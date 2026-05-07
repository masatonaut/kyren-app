import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 — SABAKU',
  description: 'Specified Commercial Transaction Act notice for SABAKU.',
}

export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="text-[18px] font-bold tracking-tight">SABAKU</Link>
        <Link href="/" className="flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
          <ArrowLeft size={14} />
          Back
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-6 pb-20">
        <h1 className="text-3xl font-bold tracking-tight mb-2">特定商取引法に基づく表記</h1>
        <p className="text-[13px] text-text-tertiary mb-10">Specified Commercial Transaction Act Notice · Last updated 2026-05-07</p>

        <table className="w-full text-[13px]">
          <tbody>
            <Row label="販売事業者">中村 柾人 (Masato Nakamura)</Row>
            <Row label="運営責任者">中村 柾人</Row>
            <Row label="所在地">
              請求があった場合に遅滞なく開示します。<br />
              <span className="text-text-tertiary">Address disclosed upon request.</span>
            </Row>
            <Row label="電話番号">
              請求があった場合に遅滞なく開示します。<br />
              <span className="text-text-tertiary">Phone disclosed upon request.</span>
            </Row>
            <Row label="メールアドレス">i.masato0907@gmail.com</Row>
            <Row label="サービス名">SABAKU - フライトストリップ式タスク管理</Row>
            <Row label="販売価格">
              <ul className="space-y-1">
                <li>Free プラン: ¥0</li>
                <li>Pro プラン: 月額 ¥800 / 年額 ¥7,200</li>
                <li>Lifetime: ¥4,900 (一括、Gumroad 経由)</li>
              </ul>
              <p className="mt-2 text-text-tertiary">税込。為替レートにより USD 価格が変動する場合があります。</p>
            </Row>
            <Row label="商品代金以外の必要料金">
              インターネット接続料金、通信費等はお客様のご負担となります。<br />
              <span className="text-text-tertiary">Internet connection fees and communication costs are the customer's responsibility.</span>
            </Row>
            <Row label="支払方法">
              クレジットカード (Stripe 経由) / Gumroad (Lifetime のみ)<br />
              <span className="text-text-tertiary">Credit card via Stripe / Gumroad (lifetime only)</span>
            </Row>
            <Row label="代金の支払時期">
              <strong>サブスクリプション</strong>: 申込時に初回課金、その後毎月/毎年自動更新<br />
              <strong>Lifetime</strong>: 申込時に一括課金
            </Row>
            <Row label="サービス提供時期">
              決済完了後、即時に Pro 機能が有効化されます。<br />
              <span className="text-text-tertiary">Pro features activate immediately after payment.</span>
            </Row>
            <Row label="返金・キャンセルポリシー">
              <strong>7日間返金保証</strong>: 購入後7日以内であれば、理由を問わず全額返金いたします。<br />
              サブスクリプションは Stripe Customer Portal からいつでも解約可能。次回更新日まで Pro 機能を利用可能です。<br />
              <span className="text-text-tertiary">7-day no-questions-asked refund. Subscriptions can be canceled anytime via Stripe Customer Portal.</span>
            </Row>
            <Row label="動作環境">
              モダンブラウザ (Chrome, Safari, Firefox, Edge の最新版)<br />
              JavaScript と Cookie が有効である必要があります。
            </Row>
          </tbody>
        </table>

        <p className="mt-10 text-[12px] text-text-tertiary">
          ご不明な点がございましたら <a href="mailto:i.masato0907@gmail.com" className="text-accent hover:underline">i.masato0907@gmail.com</a> までお問い合わせください。
        </p>
      </article>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border">
      <th className="text-left align-top py-3 pr-6 font-medium text-text-secondary w-1/3 min-w-[140px]">{label}</th>
      <td className="py-3 leading-relaxed">{children}</td>
    </tr>
  )
}
