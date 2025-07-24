import { useState, useRef } from 'react'
import { HslColorPicker } from 'react-colorful'
import './App.css'
import { supabase } from './supabaseClient'

// 카멜레온 SVG를 인라인 React 컴포넌트로 정의 (public/chameleon.svg 내용 복사 필요)
import ChameleonSVG from './ChameleonSVG'

function App() {
  const [color, setColor] = useState({ h: 200, s: 100, l: 50 })
  const [sent, setSent] = useState(false)
  const [isExploding, setIsExploding] = useState(false)
  const [explosionKey, setExplosionKey] = useState(0)
  const touchAreaRef = useRef(null)

  // HSL to CSS color 변환
  const hslToCss = (hsl) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  // 색상 전송 함수 (Supabase 연동)
  const sendColor = async () => {
    setSent(true)
    
    // 연속 클릭을 위해 키를 변경하여 새로운 애니메이션 트리거
    setExplosionKey(prev => prev + 1)
    setIsExploding(true)
    
    // 팡 터지는 효과 시작
    setTimeout(() => {
      setIsExploding(false)
    }, 2000) // 2초 후 효과 종료
    
    setTimeout(() => {
      setSent(false)
    }, 1000)
    
    // Supabase에 색상 데이터 전송
    try {
      const { data, error } = await supabase
        .from('colors')
        .insert([
          { 
            color_value: hslToCss(color),
            hue: color.h,
            saturation: color.s,
            lightness: color.l,
            created_at: new Date().toISOString()
          }
        ])
      
      if (error) {
        console.error('색상 전송 실패:', error)
      } else {
        console.log('색상 전송 성공:', data)
      }
    } catch (err) {
      console.error('Supabase 연결 오류:', err)
    }
  }

  // 모바일 탭/클릭 이벤트 핸들러
  const handleTouch = () => {
    sendColor()
  }

  return (
    <div className="container">
      {/* 팡 터지는 효과 오버레이 */}
      {isExploding && (
        <div 
          key={explosionKey}
          className="explosion-overlay"
          style={{ backgroundColor: hslToCss(color) }}
        />
      )}
      
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
