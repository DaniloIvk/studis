import { useState, useEffect, useRef } from 'react';
import { t } from 'i18next';
import type { MorePages as MorePagesType } from '../../types/Paginator';

function MorePages({ fromPage, toPage, onClick }: MorePagesType) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number>(fromPage);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync value when range changes or opens
  useEffect(() => {
    setValue(fromPage);
  }, [fromPage, isOpen]);

  // Outside click logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Wheel "Spinner" logic
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!isOpen) return;
      event.preventDefault();

      const direction = event.deltaY > 0 ? -1 : 1;
      setValue((prev) =>
        Math.min(Math.max(prev + direction, fromPage), toPage),
      );
    };

    const inputElement = inputRef.current;
    if (isOpen && inputElement) {
      inputElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => inputElement?.removeEventListener('wheel', handleWheel);
  }, [isOpen, fromPage, toPage]);

  function handleConfirm() {
    if (value >= fromPage && value <= toPage) {
      onClick(value);
      setIsOpen(false);
    }
  }

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value === '' ? 0 : Number(event.target.value);
    setValue(newValue > toPage ? toPage : newValue);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') handleConfirm();
    if (event.key === 'Escape') setIsOpen(false);
  }

  return (
    <div ref={containerRef} className='relative h-full flex items-center'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='h-full px-1 leading-5 opacity-50 hover:opacity-100 hover:scale-y-110 drop-shadow-icon cursor-pointer'
      >
        …
      </button>

      {isOpen && (
        <div className='bg-light! dark:bg-dark! text-dark! dark:text-light! border-primary! absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 flex flex-col items-center gap-4 w-fit min-w-32 border rounded-xl shadow-md text-pretty wrap-normal z-40 select-none'>
          <span className='text-primary! dark:text-primary-light! font-bold text-nowrap tracking-widest'>
            {fromPage} — {toPage}
          </span>

          <input
            ref={inputRef}
            type='number'
            min={fromPage}
            max={toPage}
            value={value || ''}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            autoFocus
            className='bg-dark/5! dark:bg-light/10! text-dark! dark:text-light! w-full text-center p-2 rounded-md border-none outline-none'
          />

          <button
            type='button'
            onClick={handleConfirm}
            className='bg-primary! hover:bg-primary-hover! text-light! w-fit px-3 py-2 mt-2 rounded-md transition-all cursor-pointer'
          >
            {t('buttons.go_to_page')}
          </button>
        </div>
      )}
    </div>
  );
}

export default MorePages;
