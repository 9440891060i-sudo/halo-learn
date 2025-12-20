import { FaApple, FaGooglePlay, FaLink } from "react-icons/fa";

const Download = () => {
  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        color: "#0f1724",
        fontFamily:
          "Inter,system-ui,Segoe UI,Roboto,-apple-system,Helvetica,Arial",
      }}
    >
      <div style={{ maxWidth: 760, margin: "72px auto", padding: 28 }}>
        <h1 style={{ fontSize: 22, marginBottom: 16 }}>Download Tricher AI</h1>

        {/* Android */}
        <section
          style={{
            border: "1px solid #f1f5f9",
            padding: 18,
            borderRadius: 12,
            marginBottom: 14,
          }}
        >
          <strong>Android</strong>

          <div style={{ marginTop: 12 }}>
            <button
              disabled
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 10,
                background: "#eef2f7",
                color: "#6b7280",
                border: "none",
                fontSize: 14,
                cursor: "not-allowed",
              }}
            >
              <FaGooglePlay size={16} />
              Download APK
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
            Available soon on Google Play
          </div>
        </section>

        {/* iOS */}
        <section
          style={{
            border: "1px solid #f1f5f9",
            padding: 18,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <strong>iOS</strong>

          <div style={{ marginTop: 12 }}>
            <button
              disabled
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 10,
                background: "#eef2f7",
                color: "#6b7280",
                border: "none",
                fontSize: 12,
                cursor: "not-allowed",
              }}
            >
              <FaApple size={18} />
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
            Coming soon on App Store
          </div>
        </section>

        {/* EARLY ACCESS */}
        <section
          style={{
            border: "1px solid #e5e7eb",
            padding: 20,
            borderRadius: 14,
            background: "#fafafa",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Early Access
          </div>

 <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 999,
    background: "#111827",
    color: "#fff",
    fontSize: 12,
    marginBottom: 10,
    cursor: "default",
    userSelect: "none",
  }}
>
  <FaLink size={12} />
  tricherai.apk
</div>



          <div
            style={{
              fontSize: 13,
              color: "#374151",
            }}
          >
            Available first for android users.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Download;
