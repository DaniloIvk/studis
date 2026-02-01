import type { PageNumber } from '../../types/Paginator';

function CurrentPage({ pageNumber }: PageNumber) {
  return (
    <span className='h-full px-1 leading-5 scale-y-110 drop-shadow-icon cursor-default!'>
      {pageNumber}
    </span>
  );
}

export default CurrentPage;
