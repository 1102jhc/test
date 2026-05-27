/** @type {import('next').NextConfig} */
const nextConfig = {
  // 웹팩 HMR(실시간 반영) 보안 차단막을 완벽하게 해제하는 공식 표준 옵션
  allowedDevOrigins: ['192.168.0.10'],
};

module.exports = nextConfig;