import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react'
import { importClients } from '../lib/clients'
import { showToast } from './Toast'

export default function CsvImport({ userId, onComplete }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const parseCSV = (text) => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      if (values.length < 2) continue

      const row = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx] || ''
      })

      rows.push({
        name: row.name || row.nome || row.cliente || values[0],
        email: row.email || row.e_mail || row.correio || values[1] || null,
        phone: row.phone || row.telefone || row.celular || values[2] || null,
        company: row.company || row.empresa || row.negocio || values[3] || null,
      })
    }

    return rows.filter(r => r.name)
  }

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return

    if (!f.name.endsWith('.csv')) {
      setError('Arquivo deve ser .csv')
      return
    }

    setFile(f)
    setError(null)

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = parseCSV(evt.target.result)
        if (data.length === 0) {
          setError('Nenhum cliente encontrado no arquivo')
          return
        }
        setPreview(data.slice(0, 10))
      } catch (err) {
        setError('Erro ao processar arquivo')
      }
    }
    reader.readAsText(f)
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (evt) => {
        try {
          const data = parseCSV(evt.target.result)
          const result = await importClients(userId, data)
          showToast(`${result.length} clientes importados!`, 'success')
          onComplete()
        } catch (err) {
          setError('Erro ao importar: ' + err.message)
          showToast('Erro na importação', 'error')
        } finally {
          setImporting(false)
        }
      }
      reader.readAsText(file)
    } catch (err) {
      setError('Erro ao ler arquivo')
      setImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const f = e.dataTransfer.files[0]
          if (f) {
            const event = { target: { files: [f] } }
            handleFile(event)
          }
        }}
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-accent-violet/30 hover:bg-accent-violet/5 transition-all"
      >
        <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
        <Upload size={32} className="mx-auto mb-3 text-gray-500" />
        <p className="text-sm text-gray-400 mb-1">
          {file ? file.name : 'Arraste um arquivo CSV ou clique para selecionar'}
        </p>
        <p className="text-xs text-gray-600">
          Formato: nome, email, telefone, empresa
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Prévia ({preview.length} de {file ? '...' : '0'} clientes)</h4>
          <div className="bg-black/20 border border-white/5 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">Nome</th>
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03]">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2 text-gray-400">{row.email || '-'}</td>
                    <td className="px-3 py-2 text-gray-400">{row.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button onClick={() => { setFile(null); setPreview([]); setError(null) }} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button onClick={handleImport} disabled={importing} className={`btn-primary px-5 py-2 text-sm ${importing ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {importing ? 'Importando...' : `Importar ${preview.length}+ clientes`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
