const fs = require('fs')
const path = require('path')

console.log('🔍 DB 환경변수 확인 중...')

// .env 파일 읽기
const envPath = path.join(__dirname, '..', '.env')
const requiredVars = [
	'DB_USER',
	'DB_PASSWORD',
	'DB_HOST',
	'DB_PORT',
	'DB_SERVICE',
]

if (!fs.existsSync(envPath)) {
	console.log('❌ .env 파일을 찾을 수 없습니다.')
	console.log('💡 프로젝트 루트에 .env 파일을 생성하세요.')
	process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}

envContent.split('\n').forEach((line) => {
	const trimmedLine = line.trim()
	if (trimmedLine && !trimmedLine.startsWith('#')) {
		const [key, value] = trimmedLine.split('=')
		if (key && value) {
			envVars[key.trim()] = value.trim()
		}
	}
})

let allValid = true
requiredVars.forEach((varName) => {
	const value = envVars[varName] || process.env[varName]
	if (value) {
		console.log(
			`✅ ${varName}: ${varName.includes('PASSWORD') ? '***' : value}`
		)
	} else {
		console.log(`❌ ${varName}: 누락됨`)
		allValid = false
	}
})

if (allValid) {
	console.log('\n🎉 모든 DB 환경변수가 설정되었습니다!')
} else {
	console.log('\n⚠️ 일부 DB 환경변수가 누락되었습니다.')
	console.log('💡 .env 파일에 다음 변수들을 설정하세요:')
	console.log('DB_USER=your_username')
	console.log('DB_PASSWORD=your_password')
	console.log('DB_HOST=localhost')
	console.log('DB_PORT=1521')
	console.log('DB_SERVICE=your_service_name')
	process.exit(1)
}
