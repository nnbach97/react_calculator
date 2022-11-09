import React, { useEffect, useRef, useState } from 'react';
import './calculator.css';
import {btns, BTN_ACTIONS} from "./btnConfig";

const Calculator = () => {
  const [expression, setExpression] = useState('')
  const btnRef = useRef(null);
  const expRef = useRef(null);

  useEffect(() => {
    const btns = Array.from(btnRef.current.querySelectorAll('button'));
    btns.forEach(e => e.style.height = e.offsetWidth + 'px')
  }, [])

  const handleClickBtn = (item) => {
    const expDiv = expRef.current;
    if(item.action === BTN_ACTIONS.THEME) {
      document.querySelector('.calcu').classList.toggle('dark')
    }

    if(item.action === BTN_ACTIONS.ADD) {
      addAnimaSpan(item.display);

      // chuyển phép nhân
      const option = item.display !== 'x' ? item.display : '*';
      setExpression(expression + option);
    }

    if(item.action === BTN_ACTIONS.DELETE) {
      expDiv.parentNode.querySelector('.calcu-result__exp:last-child').innerHTML = '';
      expDiv.innerHTML = ''
      setExpression('')
    }

    if(item.action === BTN_ACTIONS.CALC) {
      if(expression.trim().length <= 0) return;

      expDiv.parentNode.querySelector('.calcu-result__exp:last-child').remove();
      const cloneNode = expDiv.cloneNode(true);
      expDiv.parentNode.appendChild(cloneNode)

      const transform = `translateY(${- (expDiv.offsetHeight + 15) + 'px'}) scale(0.4)`
      try {
        // eslint-disable-next-line no-eval
        let res = eval(expression);
        setExpression(res.toString());
        setTimeout(() => {
          cloneNode.style.transform = transform;
          expDiv.innerHTML = '';
          addAnimaSpan(Math.floor(res));
        }, 200)
      } catch (error) {
        setTimeout(() => {
          cloneNode.style.transform = transform
          expDiv.innerHTML = 'Syntax error';

        }, 200)
      } finally {
        console.log('Calc Complete!!!');
      }
    }
  }

  const addAnimaSpan = (content) => {
    const expDiv = expRef.current;
    const createSpan = document.createElement('span');

    createSpan.innerHTML = content;
    createSpan.style.opacity = '0';

    expDiv.appendChild(createSpan);

    const widthSpan = createSpan.offsetWidth + 'px';
    createSpan.style.width = '0';

    setTimeout(() => {
      createSpan.style.opacity = '1';
      createSpan.style.width = widthSpan;
    }, 100)

  }
  return (
    <div className='calcu'>
      <div className="calcu-result">
        <div className="calcu-result__exp" ref={expRef}></div>
        <div className="calcu-result__exp"></div>
      </div>
      <div className="calcu-btns" ref={btnRef}>
        {
          btns.map((item,index) => (
            <button 
              key={index}
              className={item.class}
              onClick={() => handleClickBtn(item)}
            >
              {item.display}
            </button>
          ))
        }
      </div>
    </div>
  )
}

export default Calculator
