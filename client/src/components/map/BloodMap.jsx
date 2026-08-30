import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Phone,
  MapPin,
  Building2,
  User,
  Navigation,
  Radio,
  Play,
  Square,
  Compass,
  Zap,
  Clock,
  Gauge
} from 'lucide-react';
import { BloodGroupBadge } from '../common/CompatibilityBadge';

// Helper component to smoothly center map when coordinates change
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcons for Leaflet
const createHospitalIcon = () =>
  L.divIcon({
    className: 'custom-hospital-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(225, 29, 72, 0.5); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 34px; height: 34px; border-radius: 50%; background: #be123c; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(225,29,72,0.7);">
          <span style="color: white; font-weight: 800; font-size: 15px;">🏥</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
  });

const createDonorIcon = (bloodGroup, isAvailable = true) =>
  L.divIcon({
    className: 'custom-donor-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="background: ${isAvailable ? '#059669' : '#475569'}; color: white; padding: 3px 8px; border-radius: 9999px; font-weight: 800; font-size: 11px; border: 1.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.6); display: flex; align-items: center; gap: 3px;">
          <span>🩸</span> <span>${bloodGroup || 'O+'}</span>
        </div>
        <div style="width: 2px; height: 6px; background: ${isAvailable ? '#059669' : '#475569'};"></div>
      </div>
    `,
    iconSize: [48, 32],
    iconAnchor: [24, 32],
    popupAnchor: [0, -34]
  });

const createMovingDonorIcon = (bloodGroup) =>
  L.divIcon({
    className: 'custom-moving-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite; top: -6px;"></div>
        <div style="background: #2563eb; color: white; padding: 4px 9px; border-radius: 9999px; font-weight: 800; font-size: 11px; border: 2px solid #ffffff; box-shadow: 0 4px 14px rgba(37,99,235,0.8); display: flex; align-items: center; gap: 3px; z-index: 20;">
          <span>🚑</span> <span>${bloodGroup || 'O-'} IN TRANSIT</span>
        </div>
      </div>
    `,
    iconSize: [120, 36],
    iconAnchor: [60, 18],
    popupAnchor: [0, -20]
  });

const createUserGpsIcon = () =>
  L.divIcon({
    className: 'custom-user-gps-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(6, 182, 212, 0.5); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #06b6d4; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(6,182,212,0.8);">
          <div style="width: 7px; height: 7px; border-radius: 50%; background: white;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });

export const BloodMap = ({
  center = [12.9716, 77.5946],
  zoom = 12,
  hospitals = [],
  donors = [],
  highlightRadiusKm = null,
  activeHospital = null,
  height = '540px'
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [isTrackingGps, setIsTrackingGps] = useState(false);
  const [isSimulatingTransit, setIsSimulatingTransit] = useState(false);
  const [transitProgress, setTransitProgress] = useState(0); // 0 to 100%
  const [telemetry, setTelemetry] = useState({
    speedKmh: 46,
    distanceKm: 3.2,
    etaMinutes: 6,
    status: 'Ready'
  });

  const transitIntervalRef = useRef(null);

  const primaryHospital = activeHospital || (hospitals.length > 0 ? hospitals[0] : null);
  const primaryDonor = donors.length > 0 ? donors[0] : null;

  // Real-time GPS Tracking of user's device
  const toggleGpsTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    if (isTrackingGps) {
      setIsTrackingGps(false);
      setUserLocation(null);
    } else {
      setIsTrackingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setIsTrackingGps(false);
        }
      );
    }
  };

  // Generate intermediate points along route for transit simulation
  const hospLat = primaryHospital?.location?.lat || 12.9592;
  const hospLng = primaryHospital?.location?.lng || 77.6480;
  const donorLat = primaryDonor?.location?.lat || 12.9352;
  const donorLng = primaryDonor?.location?.lng || 77.6245;

  const currentMovingLat = donorLat + (hospLat - donorLat) * (transitProgress / 100);
  const currentMovingLng = donorLng + (hospLng - donorLng) * (transitProgress / 100);

  const routePolyline = [
    [donorLat, donorLng],
    [donorLat + (hospLat - donorLat) * 0.4 - 0.003, donorLng + (hospLng - donorLng) * 0.4 + 0.005],
    [donorLat + (hospLat - donorLat) * 0.7 + 0.002, donorLng + (hospLng - donorLng) * 0.7 - 0.002],
    [hospLat, hospLng]
  ];

  // Start / Stop Live Transit Simulation
  const toggleTransitSimulation = () => {
    if (isSimulatingTransit) {
      clearInterval(transitIntervalRef.current);
      setIsSimulatingTransit(false);
      setTransitProgress(0);
      setTelemetry((prev) => ({ ...prev, status: 'Standby' }));
    } else {
      setIsSimulatingTransit(true);
      setTransitProgress(0);
      setTelemetry({
        speedKmh: 48,
        distanceKm: 3.4,
        etaMinutes: 5,
        status: '🚨 En Route to Emergency Room'
      });

      transitIntervalRef.current = setInterval(() => {
        setTransitProgress((prev) => {
          if (prev >= 98) {
            clearInterval(transitIntervalRef.current);
            setIsSimulatingTransit(false);
            setTelemetry({
              speedKmh: 0,
              distanceKm: 0.0,
              etaMinutes: 0,
              status: '✅ Arrived at Hospital Transfusion Wing!'
            });
            return 100;
          }
          const next = prev + 2.5;
          const remainingDist = Math.max(0, (3.4 * (1 - next / 100)).toFixed(1));
          const remainingEta = Math.max(0, Math.ceil(5 * (1 - next / 100)));
          setTelemetry({
            speedKmh: Math.floor(42 + Math.random() * 12),
            distanceKm: remainingDist,
            etaMinutes: remainingEta,
            status: '🚨 En Route to Emergency Room'
          });
          return next;
        });
      }, 700);
    }
  };

  useEffect(() => {
    return () => {
      if (transitIntervalRef.current) clearInterval(transitIntervalRef.current);
    };
  }, []);

  const mapCenter = userLocation || (primaryHospital?.location?.lat ? [primaryHospital.location.lat, primaryHospital.location.lng] : center);

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col" style={{ height }}>
      
      {/* Live Telemetry HUD Bar (Top overlay) */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Live Status Pill */}
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            LIVE RADAR
          </span>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              {isSimulatingTransit ? `${telemetry.speedKmh} km/h` : 'Standby'}
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-mono font-bold">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              {isSimulatingTransit ? `${telemetry.distanceKm} km rem.` : `${donors.length} Donors Online`}
            </span>
            {isSimulatingTransit && (
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold animate-pulse">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                ETA: {telemetry.etaMinutes} mins
              </span>
            )}
          </div>
        </div>

        {/* Live Control Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={toggleTransitSimulation}
            className={`px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-xl transition-all ${
              isSimulatingTransit
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
            }`}
          >
            {isSimulatingTransit ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            {isSimulatingTransit ? 'Stop Transit' : 'Simulate Live ER Transit'}
          </button>

          <button
            onClick={toggleGpsTracking}
            className={`px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-xl transition-all ${
              isTrackingGps
                ? 'bg-cyan-600 text-white border border-cyan-400'
                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            {isTrackingGps ? 'GPS Active' : 'My GPS'}
          </button>
        </div>
      </div>

      {/* Map Element */}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* OpenStreetMap with Sleek Dark CSS Filter (100% Free & ZERO Watermarks) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />

        <RecenterMap center={mapCenter} zoom={zoom} />

        {/* Proximity Circle around active hospital */}
        {primaryHospital?.location?.lat && (
          <Circle
            center={[primaryHospital.location.lat, primaryHospital.location.lng]}
            radius={(highlightRadiusKm || 15) * 1000}
            pathOptions={{
              color: '#e11d48',
              fillColor: '#e11d48',
              fillOpacity: 0.08,
              weight: 1.5,
              dashArray: '5, 10'
            }}
          />
        )}

        {/* Live Transit Route Polyline */}
        {isSimulatingTransit && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              opacity: 0.8,
              dashArray: '8, 8',
              lineCap: 'round'
            }}
          />
        )}

        {/* Moving Donor Marker during Live Transit */}
        {isSimulatingTransit && (
          <Marker
            position={[currentMovingLat, currentMovingLng]}
            icon={createMovingDonorIcon(primaryDonor?.bloodGroup || 'O-')}
          >
            <Popup>
              <div className="p-2 space-y-1 text-slate-100 min-w-[200px]">
                <div className="font-bold text-xs text-blue-400 flex items-center gap-1">
                  <span>🚑</span> Rapid Transfusion Transit
                </div>
                <div className="text-xs text-slate-300">
                  <p><strong>Speed:</strong> {telemetry.speedKmh} km/h</p>
                  <p><strong>Distance to ER:</strong> {telemetry.distanceKm} km</p>
                  <p><strong>Estimated Arrival:</strong> {telemetry.etaMinutes} mins</p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live User GPS Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserGpsIcon()}>
            <Popup>
              <div className="p-1 text-xs text-slate-100 font-bold">
                📍 You (Live Device GPS Location)
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital Markers */}
        {hospitals.map((hosp) => {
          if (!hosp.location?.lat || !hosp.location?.lng) return null;
          return (
            <Marker
              key={hosp.id}
              position={[hosp.location.lat, hosp.location.lng]}
              icon={createHospitalIcon()}
            >
              <Popup>
                <div className="p-1 space-y-2 text-slate-100 min-w-[200px]">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{hosp.hospitalName}</h4>
                      <p className="text-[11px] text-slate-400">{hosp.address}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hosp.mobileNumber}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Donor Markers */}
        {donors.map((donor) => {
          if (!donor.location?.lat || !donor.location?.lng) return null;
          return (
            <Marker
              key={donor.id}
              position={[donor.location.lat, donor.location.lng]}
              icon={createDonorIcon(donor.bloodGroup, donor.isAvailable)}
            >
              <Popup>
                <div className="p-1 space-y-2 text-slate-100 min-w-[210px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm text-white">{donor.fullName}</span>
                    </div>
                    <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{donor.address || 'San Francisco, CA'}</span>
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        donor.isAvailable ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {donor.isAvailable ? '● Ready to Donate' : '○ Unavailable'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {donor.totalDonations || 0} donations
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Bottom Live Radar Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Hospital / Trauma Center
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Available Donor
          </span>
          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Live Transit Ambulance
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Sector Radius: {highlightRadiusKm || 15} km • Real-Time Geolocation
        </div>
      </div>
    </div>
  );
};
