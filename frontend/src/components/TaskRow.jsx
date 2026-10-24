import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TaskCard from './TaskCard.jsx';

export default function TaskRow({ title, tasks, emptyMessage }) {
  const headingId = useId();
  const scroller = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateArrows = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    setCanScroll({
      left: element.scrollLeft > 4,
      right: element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows, tasks.length]);

  const scrollByPage = (direction) => {
    const element = scroller.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="row" aria-labelledby={headingId}>
      <div className="row__header">
        <h2 id={headingId}>{title}</h2>
        <span className="row__count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="row__empty">{emptyMessage}</p>
      ) : (
        <div className="row__viewport">
          {canScroll.left && (
            <button
              type="button"
              className="row__arrow row__arrow--left"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollByPage(-1)}
            >
              <ChevronLeft size={28} />
            </button>
          )}
          <div
            className="row__scroller"
            ref={scroller}
            onScroll={updateArrows}
            tabIndex={0}
            role="group"
            aria-label={`${title} tasks`}
          >
            {tasks.map((task) => (
              <div className="row__item" key={task.id}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
          {canScroll.right && (
            <button
              type="button"
              className="row__arrow row__arrow--right"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollByPage(1)}
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}