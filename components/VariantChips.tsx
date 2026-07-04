"use client";

import React, { useState } from 'react';
import styles from './VariantChips.module.css';

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

  return (
    <div className={styles.container}>
      {options.map((opt) => (
        <div
          key={opt}
          className={`${styles.chip} ${selected === opt ? styles.chipSelected : ''}`}
          onClick={() => handleClick(opt)}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

