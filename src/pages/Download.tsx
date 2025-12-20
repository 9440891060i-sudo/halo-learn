import { Apple } from "lucide-react";

const Download = () => {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", color: "#0f1724", fontFamily: "Inter,system-ui,Segoe UI,Roboto,-apple-system,Helvetica,Arial" }}>
      <div style={{ maxWidth: 760, margin: "72px auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Download Tricher AI</h1>
        </div>

        {/* <p style={{ color: "#6b7280", marginTop: 0, marginBottom: 20 }}>A clean page with quick download links and store notes.</p> */}

        <section style={{ border: "1px solid #f1f5f9", padding: 18, borderRadius: 12, marginBottom: 14 }}>
          <strong>Android</strong>
          <div style={{ marginTop: 12 }}>
            <button disabled style={{ padding: "10px 14px", borderRadius: 10, background: "#eef2f7", color: "#6b7280", border: "none" }}>
              Download APK 
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#6b7280", marginTop: 10 }}>
            <span style={{ fontSize: 13 }}>Coming soon on Play Store</span>
          </div>
        </section>

        <section style={{ border: "1px solid #f1f5f9", padding: 18, borderRadius: 12 }}>
          <strong>iOS</strong>
          <div style={{ marginTop: 12 }}>
            <div style={{ color: "#6b7280" }}>Coming soon on App Store</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#6b7280", marginTop: 10 }}>
            <Apple size={18} />
            {/* <span style={{ fontSize: 13 }}>App Store listing coming soon</span> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Download;
