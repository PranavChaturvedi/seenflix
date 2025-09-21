import CardView from "./CardView";
import { Header } from "../components/Header";

export default function Watchlist() {
  return (
    <>
      <Header includeManage /> {/* add this line */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent1)] to-[var(--accent2)]">
          Your Watchlist
        </h1>
        <CardView />
      </div>
    </>
  );
}
