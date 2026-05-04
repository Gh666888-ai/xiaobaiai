// 阿里云短信服务

interface SMSConfig {
  accessKeyId: string
  accessKeySecret: string
  signName: string        // 短信签名，如 "小白AI"
  templateCode: string    // 短信模板ID，如 SMS_123456
}

const config: SMSConfig = {
  accessKeyId: process.env.ALI_ACCESS_KEY_ID || "",
  accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET || "",
  signName: "小白AI",
  templateCode: process.env.ALI_SMS_TEMPLATE || "",
}

export async function sendSMS(phone: string, code: string): Promise<boolean> {
  // 配置未就绪时跳过
  if (!config.accessKeyId || !config.templateCode) {
    console.log(`📱 [DEMO] SMS to ${phone}: ${code}`)
    return true  // 演示模式
  }

  try {
    const Core = require("@alicloud/openapi-client")
    const Dysmsapi = require("@alicloud/dysmsapi20170525")

    const client = new Dysmsapi.default(new Core.default({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: "dysmsapi.aliyuncs.com",
    }))

    await client.sendSms({
      phoneNumbers: phone,
      signName: config.signName,
      templateCode: config.templateCode,
      templateParam: JSON.stringify({ code }),
    })
    console.log(`✅ SMS sent to ${phone}`)
    return true
  } catch (err: any) {
    console.error(`❌ SMS failed:`, err.message)
    return false
  }
}
