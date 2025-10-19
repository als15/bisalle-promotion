"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, Typography, Space, Alert, Spin, Row, Col, List } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, QrcodeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function GiftPage() {
  const params = useParams();
  const code = params.code as string;
  const [qrCode, setQrCode] = useState<string>("");
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`/api/participant/${code}`);
        if (!response.ok) {
          throw new Error("Invalid code");
        }
        const data = await response.json();
        setParticipant(data);

        // Use window.location.origin to ensure we use the current domain
        const baseUrl = window.location.origin;
        const qrResponse = await fetch(
          "/api/qr?url=" + encodeURIComponent(`${baseUrl}/redeem/${code}`)
        );
        const qrData = await qrResponse.json();
        setQrCode(qrData.qrCode);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [code]);

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/chocolate-balls-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(48, 24, 180, 0.85) 0%, rgba(68, 205, 170, 0.75) 100%)',
          backdropFilter: 'blur(2px)'
        }}
      />
      <Row justify="center" style={{ width: '100%', maxWidth: 1200, position: 'relative', zIndex: 1, padding: '0 16px' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          {children}
        </Col>
      </Row>
    </div>
  );

  if (loading) {
    return (
      <PageWrapper>
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>טוען...</Text>
          </div>
        </Card>
      </PageWrapper>
    );
  }

  if (error || !participant) {
    return (
      <PageWrapper>
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
            <Title level={2}>שגיאה</Title>
            <Text type="secondary">{error || "קוד לא תקין"}</Text>
          </Space>
        </Card>
      </PageWrapper>
    );
  }

  if (participant.fulfilled) {
    return (
      <PageWrapper>
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CloseCircleOutlined style={{ fontSize: 64, color: '#8c8c8c' }} />
            <Title level={2}>כבר נוצל</Title>
            <Text type="secondary">
              המתנה כבר נוצלה בתאריך{" "}
              {new Date(participant.fulfilledAt).toLocaleDateString('he-IL')}.
            </Text>
          </Space>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 24 }}>
              <Image src="/logo.svg" alt="ביסַלֶה" width={200} height={100} style={{ margin: '0 auto' }} />
            </div>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#44cdaa', marginBottom: 16 }} />
            <Title level={2} style={{ marginBottom: 8 }}>
              מזל טוב, {participant.fullName}!
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              הצג קוד QR זה בחנות כדי לקבל את המתנה שלך
            </Text>
          </div>

          {qrCode && (
            <div
              style={{
                textAlign: 'center',
                padding: 24,
                background: '#f5f5f5',
                borderRadius: 16,
                border: '4px solid #44cdaa'
              }}
            >
              <QrcodeOutlined style={{ fontSize: 24, color: '#44cdaa', marginBottom: 12 }} />
              <div>
                <Image src={qrCode} alt="קוד QR למימוש מתנה" width={256} height={256} />
              </div>
            </div>
          )}

          <Alert
            message="חשוב:"
            description={
              <List
                size="small"
                dataSource={[
                  'צלם מסך של קוד QR לגישה קלה',
                  'הצג אותו בחנות כדי לקבל את המתנה',
                  'תקף לשימוש חד פעמי בלבד'
                ]}
                renderItem={(item) => <List.Item style={{ border: 'none', padding: '4px 0' }}>• {item}</List.Item>}
              />
            }
            type="info"
            showIcon
          />

          <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 12 }} dir="ltr">
            קוד: {code}
          </Text>
        </Space>
      </Card>
    </PageWrapper>
  );
}
