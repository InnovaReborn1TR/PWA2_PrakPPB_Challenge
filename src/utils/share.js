export const buildShareUrl = (id) => {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set('gun', String(id))
  return url.toString()
}

export const copyShareUrl = async (id) => {
  const url = buildShareUrl(id)
  if (navigator.share) {
    await navigator.share({ title: 'Bore & Barrel', url })
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(url)
  } else {
    throw new Error('Sharing is not supported in this browser.')
  }
  return url
}

export const buildWhatsAppUrl = (items, phoneNumber) => {
  const phone = String(phoneNumber || '').replace(/\D/g, '')
  if (!phone) throw new Error('WhatsApp number is not configured.')
  const lines = items.map((item) => (
    `- ${item.name} x${item.quantity} (${item.price})`
  ))
  const message = `Hi aku mau pesan ...\n${lines.join('\n')}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
