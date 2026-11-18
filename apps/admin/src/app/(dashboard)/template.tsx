/**
 * Se vuelve a montar en cada navegación: el contenido entra con un fundido y un
 * leve desplazamiento, como el cambio de pantalla de una app. La barra lateral,
 * el header y la barra de pestañas viven en el layout y no se animan.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-in duration-300 ease-out fade-in slide-in-from-bottom-2 motion-reduce:animate-none">{children}</div>;
}
