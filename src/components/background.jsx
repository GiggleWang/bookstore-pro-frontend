import { useRef, useEffect } from 'react'
import '../css/background.css'

export default function Background() {
  const count = 320,
    speed = 1,
    dist = 60,
    rSpeed = 0.05,
    rMax = 80,
    frame = 20
  const canvas = useRef(null),
    image = useRef(null)

  useEffect(() => { 
    let cvs = canvas.current,
      img = image.current,
      ctx = cvs.getContext("2d"),
      w = cvs.width = window.innerWidth,
      h = cvs.height = window.innerHeight,
      r = 0,
      rVel = rSpeed,
      points = [],
      rand = Math.random
    for (let i = 0; i < count; ++i) {
      points.push({
        size: rand() * 2 + 0.5,
        pos: {
          x: rand() * w,
          y: rand() * h
        },
        vel: {
          x: (rand() - 0.5) * speed,
          y: (rand() - 0.5) * speed
        },
        color: {
          r: rand() * 255,
          g: rand() * 255,
          b: rand() * 255,
        }
      })
    }
    setInterval(() => {
      w = cvs.width = window.innerWidth
      h = cvs.height = window.innerHeight
      r += rVel
      if ((r > rMax && rVel > 0) || (r < -rMax && rVel < 0))
        rVel *= -1
      img.style.transform = 'rotate(' + r + 'deg)'
      ctx.clearRect(0, 0, w, h)
      points.forEach((p, idx) => {
        p.pos.x += p.vel.x
        p.pos.y += p.vel.y
        if ((p.pos.x <= 0 && p.vel.x < 0) || (p.pos.x >= w && p.vel.x > 0))
          p.vel.x *= -1
        if ((p.pos.y <= 0 && p.vel.y < 0) || (p.pos.y >= h && p.vel.y > 0))
          p.vel.y *= -1
        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.size, 0, 2 * Math.PI)
        ctx.fill();
        for (let i = idx + 1; i < points.length; ++i) {
          let pi = points[i],
            xDist = pi.pos.x - p.pos.x,
            yDist = pi.pos.y - p.pos.y,
            rate = 1 - (xDist * xDist + yDist * yDist) / (dist * dist)
          if (rate > 0) {
            ctx.lineWidth = 0.4
            ctx.strokeStyle = 'rgb(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + rate + ')'
            ctx.beginPath()
            ctx.moveTo(p.pos.x, p.pos.y)
            ctx.lineTo(pi.pos.x, pi.pos.y)
            ctx.stroke()
          }
        }
      })
    }, 1000 / frame)
  }, [])

  return (
    <div id='Background'>
      <canvas ref={canvas} id='Background-canvas' />
      <div ref={image} id='Background-image' />
    </div>
  )
}