import type { PageNumber as PageNumberType } from '../../types/Paginator';

function PageNumber({ pageNumber, onClick }: PageNumberType) {
  function handleClick() {
    onClick(pageNumber);
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      className='h-full px-1 leading-5 opacity-50 hover:opacity-100 hover:scale-y-110 active:scale-y-110 drop-shadow-icon cursor-pointer'
    >
      {pageNumber}
    </button>
  );
}

export default PageNumber;
