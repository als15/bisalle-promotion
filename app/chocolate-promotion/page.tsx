'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, Typography, Space, Alert, Row, Col } from 'antd'
import { GiftOutlined } from '@ant-design/icons'
import Image from 'next/image'

const { Title, Text } = Typography

export default function ChocolatePromotion() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form] = Form.useForm()

  const handleSubmit = async (values: { fullName: string; phone: string }) => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      router.push(`/gift/${data.code}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
      {/* Dark overlay for better readability */}
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
      <Row justify="center" style={{ width: '100%', maxWidth: 1200, position: 'relative', zIndex: 1 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              borderRadius: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 24 }}>
                  <Image src="/logo.svg" alt="ביסַלֶה" width={200} height={100} style={{ margin: '0 auto' }} />
                </div>
                <GiftOutlined
                  style={{
                    fontSize: 48,
                    color: '#3018b4',
                    marginBottom: 16
                  }}
                />
                <Title level={2} style={{ marginBottom: 8 }}>
                  מבצע שוקולד ביסַלֶה
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  הירשם כדי לקבל שוקולד במתנה!
                </Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                <Form.Item label="שם מלא" name="fullName" rules={[{ required: true, message: 'אנא הכנס שם מלא' }]}>
                  <Input placeholder="ישראל ישראלי" />
                </Form.Item>

                <Form.Item
                  label="מספר טלפון"
                  name="phone"
                  rules={[
                    { required: true, message: 'אנא הכנס מספר טלפון' },
                    {
                      pattern: /^[0-9\-+() ]+$/,
                      message: 'מספר טלפון לא תקין'
                    }
                  ]}
                >
                  <Input placeholder="050-1234567" dir="ltr" />
                </Form.Item>

                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ height: 48 }}>
                  {loading ? 'שולח...' : 'קבל שוקולד במתנה'}
                </Button>
              </Form>

              <Text
                type="secondary"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: 12
                }}
              >
                מתנה אחת לאדם. בכפוף למלאי.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
