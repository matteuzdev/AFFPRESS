'use client'

import { useState } from 'react'
import { MessageCircle, Phone, X, Settings } from 'lucide-react'

interface WhatsAppWidgetProps {
    defaultPhone?: string
    defaultMessage?: string
    position?: 'left' | 'right'
}

export default function WhatsAppWidget({
    defaultPhone = '',
    defaultMessage = 'Olá! Vi sua oferta e gostaria de saber mais.',
    position = 'right'
}: WhatsAppWidgetProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isConfiguring, setIsConfiguring] = useState(false)
    const [phone, setPhone] = useState(defaultPhone)
    const [message, setMessage] = useState(defaultMessage)

    const handleSendMessage = () => {
        if (!phone) {
            setIsConfiguring(true)
            return
        }
        // Limpa o número (remove tudo que não é dígito)
        const cleanPhone = phone.replace(/\D/g, '')
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className={`fixed bottom-6 ${position === 'right' ? 'right-6' : 'left-6'} z-50 flex flex-col items-end gap-3`}>
            {/* Configuração Modal */}
            {isConfiguring && (
                <div className="bg-white rounded-2xl shadow-2xl p-4 w-80 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-800">Configurar WhatsApp</span>
                        <button onClick={() => setIsConfiguring(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Número com DDD</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="5583999999999"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Mensagem Padrão</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mt-1 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                            />
                        </div>
                        <button
                            onClick={() => setIsConfiguring(false)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Bubble */}
            {isOpen && !isConfiguring && (
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-80 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-green-500 text-white p-4 flex items-center gap-3">
                        <Phone className="w-5 h-5" />
                        <div className="flex-1">
                            <p className="font-semibold">Fale Conosco</p>
                            <p className="text-xs text-green-100">Resposta rápida via WhatsApp</p>
                        </div>
                        <button onClick={() => setIsConfiguring(true)} className="text-white/70 hover:text-white p-1">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-600">
                            {phone ? 'Clique para iniciar conversa!' : 'Configure o número para ativar.'}
                        </p>
                        <button
                            onClick={handleSendMessage}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            {phone ? 'Iniciar Conversa' : 'Configurar Número'}
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.6)] transition-all duration-300 ${isOpen ? 'rotate-0' : 'animate-bounce'}`}
                style={{ animationDuration: '2s' }}
            >
                {isOpen ? (
                    <X className="w-6 h-6 transition-transform" />
                ) : (
                    <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                )}
            </button>
        </div>
    )
}
