import { useState } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  id?: string
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D2B4DE'
]

export default function ColorPicker({ value, onChange, id }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <span>Color</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 border border-gray-800 cursor-pointer"
          style={{ backgroundColor: value }}
          title="Pick Color"
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-1 py-0 text-xs border border-gray-300"
          placeholder="#000000"
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 shadow-lg z-10">
          <div className="grid grid-cols-5 gap-1 mb-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color)
                  setIsOpen(false)
                }}
                className="w-6 h-6 border border-gray-300 hover:border-gray-800"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}