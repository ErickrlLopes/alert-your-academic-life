import logo from "@/assets/alertcampus-logo.png.asset.json";

export function BrandMark({ size = 56 }: { size?: number }) {
  return (
    <img
      src={logo.url}
      alt="Logo do AlertCampus"
      width={size}
      height={size}
      className="rounded-2xl shadow-brand"
      style={{ width: size, height: size }}
    />
  );
}
