"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { controlClass } from "./form";

/**
 * Formato colombiano: punto para miles y coma para decimales ("1.500.000,50").
 * El campo visible muestra el número formateado mientras se escribe; el valor que
 * llega al servidor va en un <input hidden> sin formato ("1500000.5").
 */

/** Número → texto formateado ("1500000.5" → "1.500.000,5") */
function format(value: number | string | null | undefined, decimals: number) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const [int, dec] = String(Math.abs(n)).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sign = n < 0 ? "-" : "";
  return dec && decimals > 0 ? `${sign}${grouped},${dec.slice(0, decimals)}` : `${sign}${grouped}`;
}

/** Texto que escribe el usuario → { visible formateado, valor limpio para el servidor } */
function normalize(input: string, decimals: number) {
  // Solo dígitos y la coma decimal. El punto siempre es separador de miles (lo pone el
  // formato): así borrar en «1.500» da «150» y no «1,50».
  const s = input.replace(/[^\d,]/g, "");
  const [intRaw = "", ...rest] = s.split(",");
  const hasComma = s.includes(",") && decimals > 0;
  const dec = rest.join("").slice(0, decimals);
  const int = intRaw.replace(/^0+(?=\d)/, "");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const visible = hasComma ? `${grouped || "0"},${dec}` : grouped;
  const raw = int || dec ? `${int || "0"}${dec ? `.${dec}` : ""}` : "";
  return { visible, raw };
}

/** Caracteres con significado (dígitos y coma) antes de una posición: los puntos los pone el formato */
const significantBefore = (s: string, pos: number) => s.slice(0, pos).replace(/[^\d,]/g, "").length;

/** Posición en el texto formateado tras `count` caracteres con significado */
function caretAfter(s: string, count: number) {
  if (count === 0) return 0;
  let seen = 0;
  for (let i = 0; i < s.length; i++) {
    if (/[\d,]/.test(s[i]) && ++seen === count) return i + 1;
  }
  return s.length;
}

export function MoneyInput({
  name,
  defaultValue,
  value,
  onValueChange,
  decimals = 2,
  bare = false,
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type"> & {
  /** Nombre del campo que recibe el valor limpio (si se omite, no envía nada: modo controlado) */
  name?: string;
  defaultValue?: number | string | null;
  /** Modo controlado: el número actual */
  value?: number | null;
  onValueChange?: (value: number) => void;
  /** Decimales permitidos (0 para COP si se quiere solo enteros) */
  decimals?: number;
  /** Sin el estilo de control (para usarlo dentro de un contenedor propio) */
  bare?: boolean;
}) {
  const initial = value !== undefined ? value : defaultValue;
  const [text, setText] = useState(() => format(initial, decimals));
  const [raw, setRaw] = useState(() => normalize(format(initial, decimals), decimals).raw);
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  // Modo controlado: si el valor cambia desde fuera (p. ej. al añadir un servicio), reflejarlo
  const [lastValue, setLastValue] = useState(value);
  if (value !== undefined && value !== lastValue) {
    setLastValue(value);
    if (Number(raw || 0) !== Number(value || 0)) {
      const next = format(value || null, decimals);
      setText(next);
      setRaw(normalize(next, decimals).raw);
    }
  }

  // Restaurar el cursor después de reformatear
  useEffect(() => {
    if (caret.current !== null && inputRef.current && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [text]);

  // Volver al valor inicial cuando el formulario se resetea
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => {
      const next = format(defaultValue, decimals);
      setText(next);
      setRaw(normalize(next, decimals).raw);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue, decimals]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const pos = el.selectionStart ?? el.value.length;
    const next = normalize(el.value, decimals);
    // Escribiendo al final (lo habitual): el cursor sigue al final. Si se edita en medio,
    // se conserva su posición relativa a los dígitos (los puntos de miles no cuentan).
    caret.current = pos >= el.value.length ? next.visible.length : caretAfter(next.visible, significantBefore(el.value, pos));
    setText(next.visible);
    setRaw(next.raw);
    onValueChange?.(Number(next.raw || 0));
  }

  return (
    <>
      {name && <input type="hidden" name={name} value={raw} />}
      <input
        {...props}
        ref={inputRef}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={text}
        onChange={onChange}
        className={bare ? className : cn(controlClass, "h-11 tabular-nums md:h-9", className)}
      />
    </>
  );
}
