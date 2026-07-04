"use client";

import React, { useState } from 'react';

interface VariantChipsProps {
  options: string[];
  onSelect?: (selected: string) => void;
}

export default function VariantChips({ options, onSelect }: VariantChipsProps) {
  const [selected, setSelected] = useState<string>('');

  const handleClick = (value: string) => {
    setSelected(value);
    if (onSelect) onSelect(value);
  };

  const chipStyle: React.CSSProperties = {
    border: '1px solid #d4af37',
    borderRadius: '9999px',
    padding: '4px 12px',
    margin: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: '#d4af37',
    background: 'transparent',
    transition: 'all 0.2s ease-in-out',
  };

  const selectedStyle: React.CSSProperties = {
    ...chipStyle,
    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
    color: '#050505',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
      {options.map((opt) => (
        <div key={opt} style={selected === opt ? selectedStyle : chipStyle} onClick={() => handleClick(opt)}>
          {opt}
        </div>
      ))}
    </div>
  );
}
