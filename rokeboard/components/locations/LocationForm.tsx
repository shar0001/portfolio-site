'use client'
import { useState } from 'react'
import type { Location, LocationStatus, FacilityStatus, RainSupport, SoundAllowed } from '@/lib/types'
import { LOCATION_STATUS_LABELS } from '@/lib/types'
import { Input, Textarea, Select, ToggleGroup, SectionHeader } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

type LocationFormData = Omit<Location, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>

interface LocationFormProps {
  initial?: Partial<Location>
  onSubmit: (data: LocationFormData) => void
  onCancel: () => void
  submitLabel?: string
}

const facilityOptions: { value: FacilityStatus; label: string }[] = [
  { value: 'yes', label: 'あり' },
  { value: 'no', label: 'なし' },
  { value: 'unknown', label: '確認中' },
]

const rainOptions: { value: RainSupport; label: string }[] = [
  { value: 'yes', label: 'あり' },
  { value: 'partial', label: '一部あり' },
  { value: 'no', label: 'なし' },
  { value: 'unknown', label: '確認中' },
]

const soundOptions: { value: SoundAllowed; label: string }[] = [
  { value: 'yes', label: '可' },
  { value: 'confirm', label: '要確認' },
  { value: 'no', label: '不可' },
  { value: 'unknown', label: '確認中' },
]

export function LocationForm({ initial, onSubmit, onCancel, submitLabel = '追加する' }: LocationFormProps) {
  const def = <T,>(v: T | undefined, fallback: T): T => v ?? fallback

  const [name, setName] = useState(def(initial?.name, ''))
  const [address, setAddress] = useState(def(initial?.address, ''))
  const [mapUrl, setMapUrl] = useState(def(initial?.mapUrl, ''))
  const [officialUrl, setOfficialUrl] = useState(def(initial?.officialUrl, ''))
  const [contactName, setContactName] = useState(def(initial?.contactName, ''))
  const [phone, setPhone] = useState(def(initial?.phone, ''))
  const [email, setEmail] = useState(def(initial?.email, ''))
  const [price, setPrice] = useState(def(initial?.price, ''))
  const [availableTime, setAvailableTime] = useState(def(initial?.availableTime, ''))
  const [extensionFee, setExtensionFee] = useState(def(initial?.extensionFee, ''))
  const [cancellationPolicy, setCancellationPolicy] = useState(def(initial?.cancellationPolicy, ''))
  const [paymentTerms, setPaymentTerms] = useState(def(initial?.paymentTerms, ''))
  const [parking, setParking] = useState<FacilityStatus>(def(initial?.parking, 'unknown'))
  const [waitingRoom, setWaitingRoom] = useState<FacilityStatus>(def(initial?.waitingRoom, 'unknown'))
  const [power, setPower] = useState<FacilityStatus>(def(initial?.power, 'unknown'))
  const [toilet, setToilet] = useState<FacilityStatus>(def(initial?.toilet, 'unknown'))
  const [makeupRoom, setMakeupRoom] = useState<FacilityStatus>(def(initial?.makeupRoom, 'unknown'))
  const [rainSupport, setRainSupport] = useState<RainSupport>(def(initial?.rainSupport, 'unknown'))
  const [soundAllowed, setSoundAllowed] = useState<SoundAllowed>(def(initial?.soundAllowed, 'unknown'))
  const [fireAllowed, setFireAllowed] = useState<FacilityStatus>(def(initial?.fireAllowed, 'unknown'))
  const [permissionStatus, setPermissionStatus] = useState(def(initial?.permissionStatus, ''))
  const [ngRules, setNgRules] = useState(def(initial?.ngRules, ''))
  const [loadingRules, setLoadingRules] = useState(def(initial?.loadingRules, ''))
  const [vehicleLimit, setVehicleLimit] = useState(def(initial?.vehicleLimit, ''))
  const [peopleLimit, setPeopleLimit] = useState(def(initial?.peopleLimit, ''))
  const [usableArea, setUsableArea] = useState(def(initial?.usableArea, ''))
  const [status, setStatus] = useState<LocationStatus>(def(initial?.status, 'none'))
  const [lastContactDate, setLastContactDate] = useState(def(initial?.lastContactDate, ''))
  const [nextFollowUpDate, setNextFollowUpDate] = useState(def(initial?.nextFollowUpDate, ''))
  const [memo, setMemo] = useState(def(initial?.memo, ''))
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('ロケ地名は必須です')
      return
    }
    setError('')
    onSubmit({
      name: name.trim(),
      address, mapUrl, officialUrl, contactName, phone, email,
      price, availableTime, extensionFee, cancellationPolicy, paymentTerms,
      parking, waitingRoom, power, toilet, makeupRoom,
      rainSupport, soundAllowed, fireAllowed,
      permissionStatus, ngRules, loadingRules, vehicleLimit, peopleLimit, usableArea,
      status, lastContactDate, nextFollowUpDate, memo,
      dateAvailability: def(initial?.dateAvailability, {}),
      contactHistory: def(initial?.contactHistory, []),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-8">
      {/* 基本情報 */}
      <section className="space-y-4">
        <SectionHeader title="基本情報" />
        <Input
          label="ロケ地名"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例：ファームリゾート御宿、渋谷ハウススタジオ"
          error={error}
        />
        <Input
          label="住所"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="例：千葉県夷隅郡御宿町田代831-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Google Map URL"
            value={mapUrl}
            onChange={e => setMapUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
            type="url"
          />
          <Input
            label="公式URL"
            value={officialUrl}
            onChange={e => setOfficialUrl(e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>
      </section>

      {/* 連絡先 */}
      <section className="space-y-4">
        <SectionHeader title="連絡先" />
        <Input
          label="担当者名"
          value={contactName}
          onChange={e => setContactName(e.target.value)}
          placeholder="例：山田 健一"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="電話番号"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="例：0470-68-XXXX"
            type="tel"
          />
          <Input
            label="メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="例：info@location.jp"
            type="email"
          />
        </div>
      </section>

      {/* 料金・条件 */}
      <section className="space-y-4">
        <SectionHeader title="料金・利用条件" />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="料金"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="例：¥22,000＋延長¥8,000/h"
          />
          <Input
            label="利用可能時間"
            value={availableTime}
            onChange={e => setAvailableTime(e.target.value)}
            placeholder="例：13:00〜18:00"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="延長料金"
            value={extensionFee}
            onChange={e => setExtensionFee(e.target.value)}
            placeholder="例：¥8,000/時間"
          />
          <Input
            label="支払い条件"
            value={paymentTerms}
            onChange={e => setPaymentTerms(e.target.value)}
            placeholder="例：銀行振込（撮影1週間前まで）"
          />
        </div>
        <Input
          label="キャンセル規定"
          value={cancellationPolicy}
          onChange={e => setCancellationPolicy(e.target.value)}
          placeholder="例：3日前まで無料。前日50%、当日100%。"
        />
      </section>

      {/* 設備 */}
      <section className="space-y-4">
        <SectionHeader title="設備" description="「確認中」はあとから更新できます" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleGroup label="駐車場" value={parking} onChange={v => setParking(v as FacilityStatus)} options={facilityOptions} />
          <ToggleGroup label="控室" value={waitingRoom} onChange={v => setWaitingRoom(v as FacilityStatus)} options={facilityOptions} />
          <ToggleGroup label="電源" value={power} onChange={v => setPower(v as FacilityStatus)} options={facilityOptions} />
          <ToggleGroup label="トイレ" value={toilet} onChange={v => setToilet(v as FacilityStatus)} options={facilityOptions} />
          <ToggleGroup label="メイクルーム" value={makeupRoom} onChange={v => setMakeupRoom(v as FacilityStatus)} options={facilityOptions} />
          <ToggleGroup label="雨天対応" value={rainSupport} onChange={v => setRainSupport(v as RainSupport)} options={rainOptions} />
          <ToggleGroup label="音出し" value={soundAllowed} onChange={v => setSoundAllowed(v as SoundAllowed)} options={soundOptions} />
          <ToggleGroup label="火気使用" value={fireAllowed} onChange={v => setFireAllowed(v as FacilityStatus)} options={facilityOptions} />
        </div>
      </section>

      {/* 撮影条件 */}
      <section className="space-y-4">
        <SectionHeader title="撮影条件" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="撮影許可状況" value={permissionStatus} onChange={e => setPermissionStatus(e.target.value)} placeholder="例：申請済み、不要" />
          <Input label="車両台数" value={vehicleLimit} onChange={e => setVehicleLimit(e.target.value)} placeholder="例：普通車3台、2tトラック1台" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="人数制限" value={peopleLimit} onChange={e => setPeopleLimit(e.target.value)} placeholder="例：30名以内" />
          <Input label="使用可能エリア" value={usableArea} onChange={e => setUsableArea(e.target.value)} placeholder="例：ガーデン全域" />
        </div>
        <Textarea label="NG事項" value={ngRules} onChange={e => setNgRules(e.target.value)} placeholder="例：ドローン使用不可、農場エリアへの立入禁止" rows={2} />
        <Textarea label="搬入・搬出条件" value={loadingRules} onChange={e => setLoadingRules(e.target.value)} placeholder="例：機材車は専用駐車場へ" rows={2} />
      </section>

      {/* 管理 */}
      <section className="space-y-4">
        <SectionHeader title="管理情報" />
        <Select label="ステータス" value={status} onChange={e => setStatus(e.target.value as LocationStatus)}>
          {(Object.keys(LOCATION_STATUS_LABELS) as LocationStatus[]).map(s => (
            <option key={s} value={s}>{LOCATION_STATUS_LABELS[s]}</option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">最終連絡日</label>
            <input type="date" value={lastContactDate} onChange={e => setLastContactDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">次回確認日</label>
            <input type="date" value={nextFollowUpDate} onChange={e => setNextFollowUpDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <Textarea label="メモ" value={memo} onChange={e => setMemo(e.target.value)} placeholder="自由メモ" rows={3} />
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white py-4 border-t border-slate-100 -mx-6 px-6 -mb-6">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          キャンセル
        </Button>
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
