import { ImageResponse } from "next/og";
import { games } from "@/lib/games";
export const alt = "Tomorrowly Arcade — Good games. Great distractions.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "65px", background: "#fffefa", color: "#202126", fontFamily: "sans-serif" }}><div style={{ fontSize: 30, display: "flex" }}>tomorrowly / arcade</div><div style={{ fontSize: 80, letterSpacing: -4, fontWeight: 700, marginTop: 55, lineHeight: 1.05, display: "flex", flexDirection: "column" }}><span>Good games.</span><span>Great distractions.</span></div><div style={{ marginTop: 35, display: "flex", flexWrap: "wrap", gap: 12 }}>{games.map((game, i) => <div key={game.id} style={{ background: ["#c9eaff", "#c7f4dc", "#e0dcff", "#fff0ce", "#ffdcdf", "#c9eaff"][i], padding: "18px 22px", borderRadius: 20, fontSize: 20, display: "flex" }}>{game.name}</div>)}</div></div>, size);
}
