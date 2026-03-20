import React from "react";

const toText = (value, fallback = "Đã xảy ra lỗi không xác định.") => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: toText(error?.message || error),
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-shell" style={{ display: "grid", placeItems: "center" }}>
          <section className="surface-card" style={{ width: "min(760px, 100%)", padding: "24px" }}>
            <h2 style={{ marginBottom: "10px" }}>Không thể hiển thị trang</h2>
            <p style={{ margin: 0, color: "#c5cede" }}>
              Ứng dụng gặp lỗi runtime nên trang bị trắng/đen. Hãy refresh lại trang,
              nếu vẫn lỗi thì gửi nội dung lỗi bên dưới để fix ngay.
            </p>
            <pre
              style={{
                marginTop: "14px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#0f1118",
                border: "1px solid #ffffff1f",
                borderRadius: "10px",
                padding: "12px",
                color: "#fecaca",
              }}
            >
              {toText(this.state.errorMessage)}
            </pre>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
