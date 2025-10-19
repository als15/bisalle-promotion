"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, Space, Alert, Row, Col } from "antd";
import { ScanOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Title, Text } = Typography;

export default function ShopScan() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const handleScan = async (values: { code: string }) => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // First, get participant info
      const participantRes = await fetch(`/api/participant/${values.code}`);
      if (!participantRes.ok) {
        throw new Error("קוד לא תקין");
      }
      const participant = await participantRes.json();

      // Check if already fulfilled
      if (participant.fulfilled) {
        setError(
          `כבר מומש בתאריך ${new Date(
            participant.fulfilledAt
          ).toLocaleDateString('he-IL')}`
        );
        setLoading(false);
        return;
      }

      // Mark as fulfilled
      const redeemRes = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: values.code }),
      });

      const redeemData = await redeemRes.json();

      if (!redeemRes.ok) {
        throw new Error(redeemData.error || "Failed to fulfill");
      }

      setResult(redeemData.participant);
      form.resetFields();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <Card style={{ borderRadius: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 24 }}>
                  <Image src="/logo.svg" alt="ביסַלֶה" width={200} height={100} style={{ margin: '0 auto' }} />
                </div>
                <ScanOutlined style={{ fontSize: 48, color: '#3018b4', marginBottom: 16 }} />
                <Title level={2} style={{ marginBottom: 8 }}>
                  סורק חנות
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  סרוק קודי QR של לקוחות למימוש מתנות
                </Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleScan} size="large">
                <Form.Item
                  label="הכנס קוד או סרוק QR"
                  name="code"
                  rules={[{ required: true, message: 'אנא הכנס קוד מימוש' }]}
                >
                  <Input
                    placeholder="הכנס קוד מימוש"
                    dir="ltr"
                    autoFocus
                    style={{ fontFamily: 'monospace', fontSize: 18 }}
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{ height: 48 }}
                  icon={<ScanOutlined />}
                >
                  {loading ? 'מעבד...' : 'מימוש מתנה'}
                </Button>
              </Form>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  icon={<CloseCircleOutlined />}
                />
              )}

              {result && (
                <Alert
                  message="המתנה מומשה בהצלחה!"
                  description={
                    <div>
                      <Text strong>{result.fullName}</Text>
                      <br />
                      <Text type="secondary" dir="ltr">{result.phone || result.email}</Text>
                    </div>
                  }
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />
              )}

              <Text type="secondary" style={{ display: 'block', textAlign: 'center', fontSize: 12 }}>
                לשימוש צוות החנות בלבד
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
