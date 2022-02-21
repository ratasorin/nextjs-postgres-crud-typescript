import { FC, forwardRef, useEffect, useRef } from 'react';
import { debounceTime, exhaustMap, fromEvent, tap } from 'rxjs';
import { action } from 'store';
import buttonStyle from './button.module.css';

const Button: FC<{ payload: string; onClick: () => unknown }> = ({
  payload,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current)
      fromEvent(buttonRef.current, 'click')
        .pipe(
          debounceTime(500),
          tap(() => {
            onClick();
          })
        )
        .subscribe();
  }, []);
  return (
    <button ref={buttonRef} className={buttonStyle.button}>
      {payload}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;