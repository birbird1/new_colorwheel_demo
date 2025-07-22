import { useState, useRef } from 'react'
import { HslColorPicker } from 'react-colorful'
import './App.css'

// 카멜레온 SVG를 인라인 React 컴포넌트로 정의 (public/chameleon.svg 내용 복사 필요)
import ChameleonSVG from './ChameleonSVG'

function App() {
  const [color, setColor] = useState({ h: 200, s: 100, l: 50 })
  const [sent, setSent] = useState(false)
  const touchAreaRef = useRef(null)

  // HSL to CSS color 변환
  const hslToCss = (hsl) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  // 색상 전송 함수 (Firebase 연동 시 실제 데이터 전송)
  const sendColor = () => {
    setSent(true)
    setTimeout(() => setSent(false), 1000)
    // 실제 연동 시 아래 코드 사용
    // set(ref(database, 'color'), { value: hslToCss(color) })
  }

  // 모바일 탭/클릭 이벤트 핸들러
  const handleTouch = () => {
    sendColor()
  }

  return (
    <div className="container">
      <h1>당신의 컬러는 무엇인가요?</h1>
      <div className="chameleon-area">
        <ChameleonSVG color={hslToCss(color)} />
      </div>
      <div className="color-picker-area">
        <HslColorPicker color={color} onChange={setColor} />
        <div className="color-value">{hslToCss(color)}</div>
      </div>
      <div
        className={`send-area${sent ? ' sent' : ''}`}
        ref={touchAreaRef}
        onClick={handleTouch}
        onTouchStart={handleTouch}
      >
        <span>{sent ? '색상 전송됨!' : '여기를 탭해서 색상 전송'}</span>
      </div>
    </div>
  )
}

export default App
