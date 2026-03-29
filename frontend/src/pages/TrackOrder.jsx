import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import api from "../api";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const warehousePos = [18.5204, 73.8567]; // Pune warehouse (mock)

const STEPS = [
    { status: "Pending", label: "Order Placed", icon: Package, color: "text-amber-400" },
    { status: "Accepted", label: "Order Accepted", icon: CheckCircle, color: "text-blue-400" },
    { status: "In Progress", label: "Out for Delivery", icon: Truck, color: "text-purple-400" },
    { status: "Completed", label: "Delivered", icon: CheckCircle, color: "text-emerald-400" },
];

export default function TrackOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/bookings").then(r => {
            const found = r.data.find(b => b._id === id);
            setOrder(found || null);
        }).finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen dash-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen dash-bg flex items-center justify-center">
            <div className="text-center">
                <p className="text-white font-bold text-xl mb-4">Order not found</p>
                <button onClick={() => navigate("/dashboard")} className="btn-primary px-6 py-3 rounded-xl">Back to Dashboard</button>
            </div>
        </div>
    );

    const currentStep = STEPS.findIndex(s => s.status === order.status);
    const destPos = [order.lat || 18.52, order.lng || 73.86];
    const midPos = [(warehousePos[0] + destPos[0]) / 2, (warehousePos[1] + destPos[1]) / 2 + 0.05];
    const route = [warehousePos, midPos, destPos];

    return (
        <div className="min-h-screen dash-bg py-10 px-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>

                <div className="glass rounded-3xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-black text-white">Track Order</h1>
                            <p className="text-slate-400 text-sm mt-1">{order.product_name} · {order.wood_type}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === "Completed" ? "badge-completed" :
                            order.status === "In Progress" ? "badge-progress" :
                                order.status === "Accepted" ? "badge-accepted" : "badge-pending"
                            }`}>{order.status}</span>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
                        {STEPS.map((s, i) => {
                            const done = i <= currentStep;
                            const active = i === currentStep;
                            return (
                                <div key={s.status} className="flex items-center">
                                    <div className={`flex flex-col items-center gap-2 min-w-[80px] ${done ? "opacity-100" : "opacity-30"}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${active ? "border-purple-500 bg-purple-500/20" : done ? "border-emerald-500 bg-emerald-500/20" : "border-slate-700 bg-transparent"}`}>
                                            <s.icon className={`w-5 h-5 ${active ? "text-purple-400" : done ? "text-emerald-400" : "text-slate-600"}`} />
                                        </div>
                                        <span className="text-xs text-slate-400 text-center leading-tight">{s.label}</span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`h-0.5 w-12 mx-1 mb-5 transition-all ${i < currentStep ? "bg-emerald-500" : "bg-slate-700"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Map */}
                    <div className="rounded-2xl overflow-hidden h-72 border border-white/10">
                        <MapContainer center={midPos} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                            />
                            <Marker position={warehousePos}>
                                <Popup>WoodCraft Warehouse</Popup>
                            </Marker>
                            <Marker position={destPos}>
                                <Popup>Delivery Address: {order.address}, {order.city}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        {[
                            { l: "Customer", v: order.name },
                            { l: "City", v: order.city },
                            { l: "Quantity", v: `${order.quantity} unit(s)` },
                            { l: "Ordered", v: new Date(order.created_at).toLocaleDateString() },
                        ].map(({ l, v }) => (
                            <div key={l} className="glass rounded-xl p-3">
                                <p className="text-slate-500 text-xs">{l}</p>
                                <p className="text-white font-semibold text-sm mt-0.5">{v}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
