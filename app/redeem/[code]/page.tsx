"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, Typography, Space, Button, Spin, Alert, Row, Col } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, GiftOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Title, Text } = Typography;

export default function RedeemPage() {
  const params = useParams();
  const code = params.code as string;
  const [participant, setParticipant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`/api/participant/${code}`);
        if (!response.ok) {
          throw new Error("Invalid code");
        }
        const data = await response.json();
        setParticipant(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [code]);

  const handleRedeem = async () => {
    setRedeeming(true);
    setError("");

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Redemption failed");
      }

      setSuccess(true);
      setParticipant(data.participant);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRedeeming(false);
    }
  };

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

  if (error && !participant) {
    return (
      <PageWrapper>
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
            <Title level={2}>שגיאה</Title>
            <Text type="secondary">{error}</Text>
          </Space>
        </Card>
      </PageWrapper>
    );
  }

  if (success) {
    return (
      <PageWrapper>
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ marginBottom: 24 }}>
              <Image src="/logo.svg" alt="ביסַלֶה" width={200} height={100} style={{ margin: '0 auto' }} />
            </div>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#44cdaa' }} />
            <Title level={2}>המתנה מומשה בהצלחה!</Title>
            <div>
              <Text strong style={{ fontSize: 18 }}>{participant.fullName}</Text>
              <br />
              <Text type="secondary">קיבל/ה את המתנה</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              מומש בתאריך: {new Date(participant.fulfilledAt).toLocaleString('he-IL')}
            </Text>
          </Space>
        </Card>
      </PageWrapper>
    );
  }

  if (participant?.fulfilled) {
    return (
      <PageWrapper>
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ marginBottom: 24 }}>
              <Image src="/logo.svg" alt="ביסַלֶה" width={200} height={100} style={{ margin: '0 auto' }} />
            </div>
            <CloseCircleOutlined style={{ fontSize: 64, color: '#8c8c8c' }} />
            <Title level={2}>כבר נוצל</Title>
            <div>
              <Text type="secondary">המתנה כבר נוצלה על ידי</Text>
              <br />
              <Text strong style={{ fontSize: 18 }}>{participant.fullName}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              מומש בתאריך: {new Date(participant.fulfilledAt).toLocaleString('he-IL')}
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
            <GiftOutlined style={{ fontSize: 48, color: '#3018b4', marginBottom: 16 }} />
            <Title level={2} style={{ marginBottom: 8 }}>
              מימוש מתנה
            </Title>
          </div>

          <Alert
            message="פרטי משתתף:"
            description={
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Text strong style={{ fontSize: 18, display: 'block' }}>
                  {participant.fullName}
                </Text>
                {participant.email && (
                  <Text type="secondary" style={{ display: 'block' }} dir="ltr">
                    {participant.email}
                  </Text>
                )}
                {participant.phone && (
                  <Text type="secondary" style={{ display: 'block' }} dir="ltr">
                    {participant.phone}
                  </Text>
                )}
              </div>
            }
            type="info"
            showIcon
          />

          {error && (
            <Alert message={error} type="error" showIcon />
          )}

          <Button
            type="primary"
            onClick={handleRedeem}
            loading={redeeming}
            block
            size="large"
            style={{ height: 48 }}
            icon={<CheckCircleOutlined />}
          >
            {redeeming ? 'מעבד...' : 'אישור ומסירת מתנה'}
          </Button>

          <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 12 }}>
            לחץ על הכפתור למעלה כדי לסמן את המתנה כמומשת
          </Text>
        </Space>
      </Card>
    </PageWrapper>
  );
}
