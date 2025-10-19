import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import heIL from "antd/locale/he_IL";

export const metadata: Metadata = {
  title: "ביסַלֶה - מבצע שוקולד",
  description: "סרוק כדי לקבל את המתנה שלך",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        <AntdRegistry>
          <ConfigProvider
            locale={heIL}
            direction="rtl"
            theme={{
              token: {
                colorPrimary: "#3018b4",
                colorSuccess: "#44cdaa",
                colorLink: "#3018b4",
                borderRadius: 12,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
