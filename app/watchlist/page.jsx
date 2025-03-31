"use client"
import { Header } from "../components/Header";
import CardView from "./CardView";

export default function Watchlist() {
    return (
        <>
            <Header includeManage />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">Your Watchlist</h1>
                <div>
                    <CardView />                    
                </div>
            </div>
        </>
    )
};