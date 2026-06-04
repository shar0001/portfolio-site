import type { Project, Location } from './types'
import { formatDate, formatDateShort } from './utils'

// ─── Template generation functions ───────────────────────────────────────────
// These use template-based generation now. Replace the body with AI API calls later.
// e.g., return await openai.chat.completions.create({ ... })

export function generateInquiryEmail(project: Project, location: Location): string {
  const dates = project.candidateDates
    .map(d => formatDateShort(d.date))
    .join('・')

  return `件名：撮影ロケ地のご利用について（お問い合わせ）

${location.contactName ? `${location.contactName} 様` : 'ご担当者様'}

はじめまして。${project.pmName || '制作担当'}と申します。
このたびは、映像撮影のロケ地として貴施設のご利用をご検討しており、ご連絡差し上げました。

【撮影概要】
・撮影内容：${project.shootDescription || project.title}
・撮影候補日：${dates || '調整中'}
・ご利用希望時間：${location.availableTime || '詳細応相談'}
・撮影規模：スタッフ・キャスト合計 人数調整中
・予算感：${project.budget || '応相談'}

【確認させていただきたい点】
・上記候補日の空き状況
・ご利用料金および延長料金
・駐車場の有無と台数
・控室・電源の有無
・搬入・搬出のルール
・その他ご注意点

ご多忙のところ恐縮ですが、ご確認いただけますでしょうか。
詳細についてはお電話またはメールにてご対応いただければ幸いです。

どうぞよろしくお願いいたします。

${project.pmName || '担当者名'}
${project.clientName || '所属会社名'}
E-mail：
Tel：`
}

export function generateHoldRequestEmail(project: Project, location: Location): string {
  const dates = project.candidateDates
    .map(d => formatDateShort(d.date))
    .join('・')

  return `件名：撮影ロケ地の仮キープのお願い

${location.contactName ? `${location.contactName} 様` : 'ご担当者様'}

お世話になっております。${project.pmName || '制作担当'}です。
先日はお問い合わせへのご返信をいただき、ありがとうございました。

撮影候補日（${dates}）のうち、以下の日程で仮キープをお願いできますでしょうか。

・仮キープ希望日：${dates}
・仮キープ期限：ご調整いただけましたら、〇月〇日ごろに正式可否をご連絡します

ご都合に合わせてご対応いただけますと大変助かります。
引き続きどうぞよろしくお願いいたします。

${project.pmName || '担当者名'}
Tel：`
}

export function generateReminderEmail(project: Project, location: Location): string {
  return `件名：【再送】撮影ロケ地についてのお問い合わせ

${location.contactName ? `${location.contactName} 様` : 'ご担当者様'}

お世話になっております。${project.pmName || '制作担当'}です。
先日ご送付いたしましたお問い合わせについて、ご確認いただけましたでしょうか。

お忙しいところ大変恐縮ですが、ご返信いただけますと幸いです。
もし内容についてご不明な点などございましたら、お気軽にお知らせください。

引き続きよろしくお願いいたします。

${project.pmName || '担当者名'}
Tel：`
}

export function generateDeclineEmail(project: Project, location: Location): string {
  return `件名：撮影ロケ地のご利用について（お断りのご連絡）

${location.contactName ? `${location.contactName} 様` : 'ご担当者様'}

お世話になっております。${project.pmName || '制作担当'}です。
この度はご対応いただきまして、誠にありがとうございました。

大変恐縮ではございますが、今回の撮影につきましては、撮影内容や日程の都合により、別のロケ地でのご利用とさせていただくこととなりました。

ご丁寧にご対応いただきながら、このようなご連絡となってしまい、誠に申し訳ございません。
またの機会がございましたら、ぜひよろしくお願いいたします。

今後とも何卒よろしくお願いいたします。

${project.pmName || '担当者名'}`
}

export function generateLineShareText(project: Project, locations: Location[]): string {
  const confirmedLocations = locations.filter(l => l.status === 'confirmed')
  const holdLocations = locations.filter(l => l.status === 'hold')
  const dates = project.candidateDates.map(d => formatDateShort(d.date)).join('・')

  const locationInfo = confirmedLocations.length > 0
    ? confirmedLocations.map(l => `📍 ${l.name}（${l.address || '住所確認中'}）`).join('\n')
    : holdLocations.length > 0
      ? holdLocations.map(l => `📌 ${l.name}（仮キープ中）`).join('\n')
      : 'ロケ地調整中'

  return `【${project.title}】撮影ロケ地共有

📋 案件：${project.title}
👤 クライアント：${project.clientName || '未定'}
📅 撮影候補日：${dates || '調整中'}

${locationInfo}

⚠️ 必要条件：${project.requirements || '調整中'}

詳細はロケボードで確認してください。`
}

export function generateLocationComparisonText(project: Project, locations: Location[]): string {
  if (locations.length === 0) return 'ロケ地が登録されていません。'

  const rows = locations.map(l => {
    const statusLabel: Record<string, string> = {
      none: '未連絡',
      inquired: '問い合わせ済み',
      waiting: '返信待ち',
      hold: '仮キープ中',
      confirmed: '決定',
      ng: 'NG',
      pending: '保留',
    }
    return `■ ${l.name}
  ステータス：${statusLabel[l.status] || l.status}
  料金：${l.price || '未定'}
  利用時間：${l.availableTime || '要確認'}
  駐車場：${l.parking === 'yes' ? 'あり' : l.parking === 'no' ? 'なし' : '確認中'}
  控室：${l.waitingRoom === 'yes' ? 'あり' : l.waitingRoom === 'no' ? 'なし' : '確認中'}
  雨天対応：${l.rainSupport === 'yes' ? 'あり' : l.rainSupport === 'partial' ? '一部あり' : l.rainSupport === 'no' ? 'なし' : '確認中'}
  NG事項：${l.ngRules || 'なし'}
  メモ：${l.memo || 'なし'}`
  })

  return `【${project.title}】ロケ地比較まとめ

${rows.join('\n\n')}`
}

export function generateShareEmail(project: Project, locations: Location[]): string {
  const confirmedLocations = locations.filter(l => l.status === 'confirmed')
  const holdLocations = locations.filter(l => l.status === 'hold')
  const dates = project.candidateDates.map(d => formatDate(d.date)).join('・')

  const mainLocation = confirmedLocations[0] || holdLocations[0]

  return `件名：【${project.title}】撮影準備状況のご共有

お世話になっております。${project.pmName || '制作担当'}です。
現在の撮影準備状況をご共有させていただきます。

━━━━━━━━━━━━━━━━━━━━━━━
【案件概要】
━━━━━━━━━━━━━━━━━━━━━━━
・案件名：${project.title}
・クライアント：${project.clientName || '未定'}
・撮影内容：${project.shootDescription || '未定'}
・撮影候補日：${dates || '調整中'}
・必要条件：${project.requirements || '未定'}

━━━━━━━━━━━━━━━━━━━━━━━
【ロケ地情報】
━━━━━━━━━━━━━━━━━━━━━━━
${mainLocation
    ? `・ロケ地名：${mainLocation.name}
・住所：${mainLocation.address || '未定'}
・利用時間：${mainLocation.availableTime || '調整中'}
・料金：${mainLocation.price || '調整中'}
・担当者：${mainLocation.contactName || '未定'}`
    : '現在調整中です。'}

━━━━━━━━━━━━━━━━━━━━━━━
【その他備考】
━━━━━━━━━━━━━━━━━━━━━━━
${project.memo || 'なし'}

ご確認のほど、よろしくお願いいたします。

${project.pmName || '担当者名'}`
}
