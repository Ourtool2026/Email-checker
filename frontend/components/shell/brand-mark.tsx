import { cn } from "@/lib/utils"

/** The MyStay ID house-and-check mark, drawn in white (a CSS mask over the artwork). */
export function BrandMark({
  size = 20,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn("block bg-white", className)}
      style={{
        width: size,
        height: size,
        WebkitMask: "var(--mark) center/contain no-repeat",
        mask: "var(--mark) center/contain no-repeat",
      }}
    />
  )
}

/** The app icon: the white mark on the MyStay gradient tile. */
export function BrandTile({
  size = 32,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b from-brand-sky to-brand-blue shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      <BrandMark size={Math.round(size * 0.62)} />
    </span>
  )
}
