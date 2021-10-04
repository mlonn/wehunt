import fetch from "node-fetch";
import { password, username, wehuntid } from "./credentials.js";
let token;
const getMarkers = async () => {
  const response = await fetch(
    `https://api.wehuntapp.com/v1/areas/${wehuntid}/map/markers`,
    {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    }
  );
  const json = await response.json();
  return json;
};

const auth = async () => {
  const response = await fetch("https://api.wehuntapp.com/v1/authentication", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({"email":username,"password":password}),
    method: "POST",
  });
  const json = await response.json();
  token = json.token;
  return token;
};

const updateMarker = async (marker) => {
  return fetch(
    `https://api.wehuntapp.com/v1/areas/${wehuntid}/map/markers/${marker.id}`,
    {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(marker),
      method: "PUT",
      mode: "cors",
    }
  );
};

const go = async () => {
  const token = await auth();
  const markers = await getMarkers();
  console.log(markers)
};

const upadteParkingNames = async (markers) => {
  const updatedMarkers = markers
    .filter((m) => m.type === "parking")
    .sort((a, b) => b.location.lat - a.location.lat)
    .map((p, i) => ({ ...p, name: `Parkering ${i + 1}` }));
  updatedMarkers.forEach((p) => updateMarker(p));
};

const updateStandNames = async (markers) => {
  const updatedMarkers = markers
    .filter(
      (m) =>
        m.type === "pass" || m.type === "tower"
    )
    .sort((a, b) => b.location.lat - a.location.lat)
    .map((p, i) => ({ ...p, name: `Pass ${i + 1}` }));
  updatedMarkers.forEach((p) => updateMarker(p));
};

go();
